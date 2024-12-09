export const dummyPosts = [
  {
    title: "The Evolution of Web Development",
    content: `In the ever-evolving landscape of web development, staying ahead of the curve is crucial. From the early days of static HTML pages to today's dynamic, interactive applications, the journey has been remarkable.

![Modern Web Development](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80)

The modern web stack has transformed significantly, embracing new technologies and methodologies that enhance both developer experience and user interaction.`,
    published_at: new Date().toISOString(),
  },
  {
    title: "Exploring Modern Design Patterns",
    content: `Design patterns serve as the foundation for scalable and maintainable applications. Let's explore some of the most impactful patterns in modern software development.

![Design Thinking](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80)

From MVC to MVVM, and now to more component-based architectures, the evolution of design patterns reflects our growing understanding of software architecture.`,
    published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    title: "The Impact of AI on Software Development",
    content: `Artificial Intelligence is revolutionizing how we approach software development. From code completion to automated testing, AI tools are becoming indispensable.

![AI and Technology](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80)

The integration of AI in development workflows has opened new possibilities for efficiency and innovation in software creation.`,
    published_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  }
];