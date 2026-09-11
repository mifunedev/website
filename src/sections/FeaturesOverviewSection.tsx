"use client";
import { motion } from "framer-motion";
import FeatureCard from "@/components/cards/FeatureCard";
import { MdFolder, MdSmartToy, MdMessage, MdCalendarToday, MdDescription, MdBuild } from "react-icons/md";

const features = [
  {
    icon: MdFolder,
    title: "Projects",
    description: "Organize AI work with context-aware document collections and semantic search"
  },
  {
    icon: MdSmartToy,
    title: "Assistants",
    description: "Deploy deep agents for long-running tasks with Python code mode, file context, and MCP tools"
  },
  {
    icon: MdMessage,
    title: "Threads",
    description: "Manage persistent conversations with full history and checkpoints"
  },
  {
    icon: MdCalendarToday,
    title: "Schedules",
    description: "Run deep agents on cron schedules that persist context and refine tools over time"
  },
  {
    icon: MdDescription,
    title: "Prompts",
    description: "Create reusable templates for system instructions and user queries. Search and reuse instead of retyping."
  },
  {
    icon: MdBuild,
    title: "Tools",
    description: "Extensible MCP tool ecosystem for browser automation, file access, and more"
  }
];

export default function FeaturesOverviewSection() {
  return (
    <section id="features" className="relative py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-cormorant font-light text-foreground mb-6">
            Everything You Need to Build Your
            <br />
            <span className="text-gold-500">AI Digital Workforce</span>
          </h2>
          <p className="text-xl font-montserrat text-muted-foreground max-w-3xl mx-auto">
            Orchestra provides the complete platform for creating, deploying, and managing AI agents that work for you 24/7
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
