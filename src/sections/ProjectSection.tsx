"use client";
import { useState } from "react";
import Image from "next/image";

// JSON data for the projects
const projects = [
  {
    title: "Plano Prompt Engineers Meetup",
    image:
      "https://secure.meetupstatic.com/photos/event/1/2/3/5/clean_513484661.webp",
    description:
      "A meetup group (1k+ members) for engineers, developers, and tech enthusiasts in Plano, TX. Join us for tech talks, networking, and more!",
    link: "https://www.meetup.com/plano-prompt-engineers",
  },
  {
    title: "Ruska Labs - Open Source",
    image:
      "https://github.com/ryaneggz/static/blob/main/pe-oss-gh-page.png?raw=true",
    description:
      "Open-source AI projects to help you build better chatbots, faster. Get started with our pre-built templates, or dive into the code to customize your own.",
    link: "https://github.com/mifunedev",
  },
  {
    title: "Prompt Engineers AI - Legacy",
    image:
      "https://github.com/ryaneggz/static/blob/main/promptenigineers-landing.jpg?raw=true",
    description:
      "Elevate your workflows with AI-driven chats that turn talk into tasks. Design, automate, and innovate in a chat – where every message moves mountains.",
    link: "https://ruska.ai",
  },
];

const PAGE_SIZE = 6;

const ProjectSection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const numOfPages = Math.ceil(projects.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProjects = projects.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section className="bg-black py-12" id="projects">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-4xl md:text-5xl font-semibold text-white">Community First</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentProjects.map((project, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-lg bg-gray-800 shadow-md"
            >
              <div className="flex-shrink-0">
                <Image
                  className="h-auto w-full"
                  src={project.image}
                  alt={`Project ${startIndex + index + 1} Image`}
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ maxHeight: "405px", width: "100%", height: "auto" }}
                />
              </div>
              <div className="flex-grow p-4">
                <h3 className="text-2xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mt-2 text-gray-400">{project.description}</p>
                <a
                  href={project.link}
                  className="mt-4 inline-block text-indigo-500 hover:underline"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
        {numOfPages > 1 && (
          <div className="mt-8 flex justify-center">
            {Array.from({ length: numOfPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => {
                    setCurrentPage(number);
                    const section = document.getElementById("projects");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`mx-2 rounded-md px-4 py-2 text-sm font-medium text-white ${currentPage === number ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  {number}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
