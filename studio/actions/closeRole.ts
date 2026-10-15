import { useState } from "react";
import { CloseCircleIcon } from "@sanity/icons/CloseCircle";
import { type DocumentActionComponent, useDocumentOperation } from "sanity";

/**
 * Closes an open job in one step: sets its status to closed and publishes,
 * so it leaves the careers page at the next build.
 */
export const CloseRoleAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [confirming, setConfirming] = useState(false);
  const current = (props.draft ?? props.published) as {
    status?: string;
  } | null;

  if (!current || current.status === "closed") return null;

  return {
    label: "Close role",
    icon: CloseCircleIcon,
    tone: "caution",
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      message:
        "Close this role? It leaves the careers page in about 2 minutes, and its page is hidden from search.",
      onCancel: () => {
        setConfirming(false);
        props.onComplete();
      },
      onConfirm: () => {
        patch.execute([{ set: { status: "closed" } }]);
        publish.execute();
        setConfirming(false);
        props.onComplete();
      },
    },
  };
};
