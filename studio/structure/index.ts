import type { StructureResolver } from "sanity/structure";
import { CaseIcon } from "@sanity/icons/Case";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HomeIcon } from "@sanity/icons/Home";
import { PAGE_SETTINGS } from "../lib/constants";
import { StartHere } from "../components/StartHere";

/**
 * Everything that is a claim but not yet confirmed in writing. The live site
 * won't build while any of these are shown.
 */
export const UNCONFIRMED_FILTER = `
  (_type == "clientLogo" && permissionConfirmed != true)
  || (_type == "ecosystemCompany" && relationshipConfirmed != true)
  || (_type == "homePage" && count(stats[confirmed != true]) > 0)
  || (_type in ["capability", "industry"] && count(outcomes[confirmed != true]) > 0)
  || (_type == "industry" && defined(metric) && metric.confirmed != true)
  || (_type == "caseStudy" && (count(outcomes[confirmed != true]) > 0 || count(quotes[confirmed != true]) > 0))
`;

/** The Studio's left-hand menu, arranged around what HR and marketing do. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("ManyaIT website")
    .items([
      S.listItem()
        .title("Start here")
        .id("start-here")
        .icon(HelpCircleIcon)
        .child(
          S.component(StartHere).id("start-here-pane").title("Start here"),
        ),
      S.divider(),
      S.listItem()
        .title("Careers")
        .id("careers")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Careers")
            .items([
              S.listItem()
                .title("Open roles")
                .id("open-roles")
                .child(
                  S.documentList()
                    .title("Open roles")
                    .schemaType("opportunity")
                    .filter('_type == "opportunity" && status == "open"')
                    .defaultOrdering([{ field: "postedAt", direction: "desc" }])
                    .initialValueTemplates([
                      S.initialValueTemplateItem("opportunity-new"),
                    ]),
                ),
              S.listItem()
                .title("Closed roles")
                .id("closed-roles")
                .child(
                  S.documentList()
                    .title("Closed roles")
                    .schemaType("opportunity")
                    .filter('_type == "opportunity" && status == "closed"')
                    .defaultOrdering([
                      { field: "postedAt", direction: "desc" },
                    ]),
                ),
              S.divider(),
              S.documentTypeListItem("opportunity").title("All roles"),
            ]),
        ),
      S.listItem()
        .title("Insights")
        .id("insights")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Insights")
            .items([
              S.documentTypeListItem("insight").title("Articles"),
              S.documentTypeListItem("insightCategory").title("Categories"),
            ]),
        ),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.divider(),
      S.listItem()
        .title("Website pages")
        .id("website-pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Website pages")
            .items([
              S.listItem()
                .title("Homepage")
                .id("home")
                .icon(HomeIcon)
                .child(
                  S.document()
                    .schemaType("homePage")
                    .documentId("homePage")
                    .title("Homepage"),
                ),
              S.listItem()
                .title("Other pages")
                .id("other-pages")
                .icon(DocumentsIcon)
                .child(
                  S.list()
                    .title("Other pages")
                    .items(
                      PAGE_SETTINGS.map((page) =>
                        S.listItem()
                          .title(page.title)
                          .id(page.id)
                          .child(
                            S.document()
                              .schemaType("pageSettings")
                              .documentId(page.id)
                              .title(page.title),
                          ),
                      ),
                    ),
                ),
              S.divider(),
              S.documentTypeListItem("capability").title("Capabilities"),
              S.documentTypeListItem("industry").title("Industries"),
              S.documentTypeListItem("location").title("Locations"),
            ]),
        ),
      S.listItem()
        .title("Proof & claims")
        .id("proof")
        .icon(CheckmarkCircleIcon)
        .child(
          S.list()
            .title("Proof & claims")
            .items([
              S.listItem()
                .title("Not confirmed yet")
                .id("unconfirmed")
                .child(
                  S.documentList()
                    .title("Not confirmed yet")
                    .filter(UNCONFIRMED_FILTER),
                ),
              S.divider(),
              S.documentTypeListItem("clientLogo").title("Client logos"),
              S.documentTypeListItem("ecosystemCompany").title("Ecosystem"),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .id("settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
    ]);
