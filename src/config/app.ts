import { FaGithub, FaLinkedin, FaYoutube, FaSlack } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "production";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const MEDIUM_RSS_URL = "https://medium.com/feed/@ryaneggz";

// Social Config
export const socialIcons = [
  {
    Icon: FaYoutube,
    tooltip: "@mifune-dev",
    key: "youtube",
    link: "https://www.youtube.com/@mifune-dev",
  },
  {
    Icon: FaXTwitter,
    tooltip: "@mifune_dev",
    key: "x",
    link: "https://x.com/mifune_dev",
  },
  {
    Icon: FaGithub,
    tooltip: "mifune-dev",
    key: "github",
    link: "https://github.com/ruska-ai",
  },
  {
    Icon: FaSlack,
    tooltip: "Mifune Slack",
    key: "slack",
    link: "#",
  },
  {
    Icon: FaLinkedin,
    tooltip: "Mifune",
    key: "linkedin",
    link: "https://www.linkedin.com/company/mifune-dev",
  },
];
