"use client";

import Link from "next/link";
import { FaArrowLeft, FaGithub, FaSlack } from "react-icons/fa";
import { FaXTwitter, FaLinkedin, FaYoutube, FaGlobe } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

const SocialPage = () => {
  const socials = [
    {
      name: "LinkedIn",
      handle: "Mifune",
      icon: <FaLinkedin className="text-xl" />,
      url: "https://www.linkedin.com/company/mifune-dev",
    },
    {
      name: "YouTube",
      handle: "@mifune-dev",
      icon: <FaYoutube className="text-xl" />,
      url: "https://www.youtube.com/@mifune-dev",
    },
    {
      name: "X",
      handle: "@mifune_dev",
      icon: <FaXTwitter className="text-xl" />,
      url: "https://x.com/mifune_dev",
    },
    {
      name: "Github",
      handle: "Mifune",
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/ruska-ai",
    },
    {
      name: "Slack",
      handle: "Mifune Workspace (coming soon)",
      icon: <FaSlack className="text-xl" />,
      url: "#",
    },
    {
      name: "Website",
      handle: "mifune.dev",
      icon: <FaGlobe className="text-xl" />,
      url: "https://mifune.dev",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-black p-6 text-white">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-8 flex items-center text-gray-400 hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Link>

        <div className="space-y-4">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-gray-900 p-4 transition-colors hover:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="mr-4 text-white">{social.icon}</div>
                <div>
                  <div className="flex items-center">
                    {social.name}{" "}
                    <FiExternalLink className="ml-2 text-gray-500" />
                  </div>
                  <div className="text-sm text-gray-400">{social.handle}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
