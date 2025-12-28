import { FaGithub, FaLinkedin, FaYoutube, FaSlack } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV || "production";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const MEDIUM_RSS_URL = "https://medium.com/feed/@ryaneggz";

// Social Config
export const socialIcons = [
  {
    Icon: FaYoutube,
    tooltip: "@ruska-ai",
    key: "youtube",
    link: "https://www.youtube.com/@ruska-ai",
  },
  {
    Icon: FaXTwitter,
    tooltip: "@ruska_ai",
    key: "x",
    link: "https://x.com/ruska_ai",
  },
  {
    Icon: FaGithub,
    tooltip: "ruska-ai",
    key: "github",
    link: "https://github.com/ruska-ai",
  },
  {
    Icon: FaSlack,
    tooltip: "Ruska AI Slack",
    key: "slack",
    link: "https://join.slack.com/t/ruska-ai/shared_invite/zt-3l2lnevo6-hOe5ZeoAz~xj7CFAJk2bzg",
  },
  {
    Icon: FaLinkedin,
    tooltip: "Ruska Labs",
    key: "linkedin",
    link: "https://www.linkedin.com/company/ruska-ai",
  },
];
