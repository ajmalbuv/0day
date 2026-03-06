export function generatePersonSchema(avatarUrl: string) {
  return {
    "@context": "http://schema.org",
    "@type": "Person",
    name: ["Ajmal Basheer", "ajmalbuv", "Ajmal Aju", "_.aju"],
    image: avatarUrl,
    jobTitle: ["Software Engineer", "Systems Builder", "Flutter Developer"],
    description:
      "Ajmal Basheer, a software engineer focused on scalable application development, stands at the intersection of engineering discipline and practical innovation. With a consistent record of delivering production-ready systems, he serves as a driving force behind high-performance Flutter applications and modern cross-platform solutions. Working through structured architecture and iterative refinement, Ajmal brings sharp technical insight to every stage of the development lifecycle. His solutions are designed to optimize performance, strengthen reliability, and ensure seamless user experiences across diverse environments. Committed to continuous growth, Ajmal applies analytical thinking and disciplined execution to elevate software quality, build resilient systems, and create long-term technical and financial leverage.",
    url: "https://ajmalbuv.github.io/0day/",
    sameAs: [
      "https://github.com/ajmalbuv",
      "https://instagram.com/_.aju",
      "https://twitch.tv/ajmalbuv",
      "https://linkedin.com/in/ajmalbuv",
    ],
  };
}
