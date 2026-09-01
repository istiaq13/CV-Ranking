/**
 * Pre-configured realistic sample data presets for fast demonstration and evaluation
 */

export const SAMPLE_PRESETS = [
  {
    id: "nlp-engineer",
    title: "NLP / AI Engineer",
    role: "Senior NLP & LLM Engineer",
    company: "Anthropic / Scale AI",
    badge: "AI & Machine Learning",
    resume: `ALEX RIVERA
San Francisco, CA | alex.rivera@email.com | github.com/alexrivera-nlp | linkedin.com/in/alexrivera-nlp

PROFESSIONAL SUMMARY
Machine Learning & NLP Engineer with 4+ years of experience designing and deploying scalable Transformer models, RAG systems, and semantic search pipelines. Adept in PyTorch, Hugging Face, LangChain, and Python backend microservices.

TECHNICAL SKILLS
- Languages: Python, SQL, C++, TypeScript
- ML / NLP: PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, spaCy, NLTK, Sentence-Transformers, Vector Databases (Pinecone, Qdrant, Chroma)
- Backend & Cloud: FastAPI, Docker, AWS (SageMaker, S3, EC2), Redis, Celery, PostgreSQL
- Practices: MLOps, Model Quantization (LoRA, QLoRA), CI/CD, Unit Testing

WORK EXPERIENCE
Machine Learning Engineer | Apex AI Labs | 2022 - Present
- Architected enterprise Retrieval-Augmented Generation (RAG) pipeline for document summarization, decreasing hallucination rate by 34% and improving semantic retrieval precision by 28%.
- Fine-tuned open-source LLMs (Llama-3 8B, Mistral 7B) using LoRA/QLoRA for domain-specific medical and legal document extraction, reaching 94.2% F1-score on token classification.
- Deployed high-throughput FastAPI inference microservices on AWS ECS with Triton Inference Server, handling 2.5M API requests/month at p95 latency under 120ms.
- Built automated evaluation harness utilizing synthetic datasets and LLM-as-a-judge metrics to monitor model drift in production.

Data Scientist & NLP Researcher | Nova Insights | 2020 - 2022
- Developed sentiment analysis and topic modeling pipelines analyzing 500k+ customer feedback reviews using BERT embeddings and BERTopic.
- Reduced manual tagging workload by 75% for customer success teams through automated intent classification.
- Optimized PyTorch model training pipelines with mixed-precision (FP16) and distributed data parallel (DDP), slashing training cycles by 40%.

EDUCATION
B.S. in Computer Science (Specialization in Artificial Intelligence)
University of California, Berkeley | 2016 - 2020`,
    jd: `Position: Senior NLP & LLM Systems Engineer
Company: Cognitive Horizons
Location: Remote / San Francisco, CA

ABOUT THE ROLE:
We are looking for an experienced NLP / Large Language Model Engineer to spearhead our next-generation conversational intelligence and contextual synthesis platform. You will lead the design, fine-tuning, evaluation, and production deployment of cutting-edge generative AI models.

KEY RESPONSIBILITIES:
- Architect and scale production RAG pipelines, agentic workflows, and semantic search systems.
- Fine-tune and align open-source foundation models (Llama, Mistral) using LoRA, DPO, and RLHF techniques.
- Design low-latency inference infrastructure using vLLM, TensorRT-LLM, or Triton.
- Partner with product and data engineering teams to build robust evaluation benchmarks and guardrail systems.
- Optimize multi-modal embeddings and vector index partitioning for massive enterprise datasets.

REQUIRED QUALIFICATIONS:
- 3+ years of hands-on experience building NLP / Deep Learning applications in Python and PyTorch.
- Deep expertise with Hugging Face ecosystem, vector search databases (e.g., Qdrant, Pinecone, Milvus), and modern LLM frameworks.
- Strong software engineering foundation: FastAPI, Docker, Kubernetes, CI/CD, and asynchronous programming.
- Experience with model optimization techniques (quantization, KV cache caching, batching).
- Solid grasp of prompt engineering, chain-of-thought prompting, and agent architectures.

PREFERRED QUALIFICATIONS:
- Experience with Kubernetes (k8s) cluster orchestration and GPU cluster management on GCP/AWS.
- Track record of publications in NLP conferences (ACL, EMNLP, NeurIPS) or open-source AI contributions.
- Experience with Reinforcement Learning from Human Feedback (RLHF) / Direct Preference Optimization (DPO).`
  },
  {
    id: "fullstack-dev",
    title: "Full-Stack Software Engineer",
    role: "Senior Full-Stack Developer",
    company: "Stripe / Vercel Partner",
    badge: "Web & Distributed Systems",
    resume: `JORDAN CHEN
Seattle, WA | jordan.chen@devmail.io | github.com/jordanchen | linkedin.com/in/jordan-chen-dev

SUMMARY
Full-Stack Software Engineer with 5+ years of experience building mission-critical web applications, high-throughput REST/GraphQL APIs, and responsive user interfaces. Proven expertise in Next.js, React, Node.js, TypeScript, PostgreSQL, and AWS.

CORE SKILLS
- Frontend: React 18, Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit, Zustand, HTML5, CSS3
- Backend: Node.js, Express, NestJS, Python (FastAPI), GraphQL, RESTful APIs, Prisma ORM, WebSockets
- Database & Caching: PostgreSQL, MySQL, Redis, MongoDB, Supabase
- Cloud & DevOps: AWS (Lambda, S3, CloudFront, RDS), Docker, GitHub Actions, Vercel

EXPERIENCE
Senior Full-Stack Engineer | Horizon Cloud Systems | 2021 - Present
- Spearheaded frontend migration of core customer portal to Next.js 14 App Router, cutting page load time by 52% and boosting Core Web Vitals score to 98.
- Engineered multi-tenant billing and subscription microservice using Node.js, Stripe API, and PostgreSQL, processing over $4M in annual recurring revenue with zero downtime.
- Built real-time collaborative dashboard using WebSockets and Redis pub/sub, supporting 10,000+ concurrent active sessions.
- Mentored 4 junior/mid-level engineers and standardized code review guidelines, reducing production regression bugs by 30%.

Full-Stack Developer | PixelCraft Solutions | 2019 - 2021
- Developed client web applications with React, TypeScript, and Express.js for e-commerce and SaaS clients.
- Implemented automated end-to-end testing with Playwright and Jest, increasing test coverage from 45% to 88%.
- Optimized complex SQL queries and added Redis caching layers, dropping 99th percentile API response times from 650ms to 110ms.

EDUCATION
B.S. in Software Engineering | University of Washington | 2015 - 2019`,
    jd: `Title: Senior Full-Stack Engineer
Company: CloudScale Dynamics
Location: Seattle, WA / Hybrid

JOB DESCRIPTION:
CloudScale Dynamics is building the next generation of cloud resource observability tools. We are seeking a Senior Full-Stack Engineer to lead frontend architecture and distributed backend service development.

RESPONSIBILITIES:
- Build blazing fast, intuitive web interfaces with Next.js, React, and TypeScript.
- Architect high-throughput Node.js / Go backend microservices and GraphQL/REST APIs.
- Design resilient relational database schemas using PostgreSQL and Prisma/TypeORM.
- Implement CI/CD pipelines, automated testing, and cloud infrastructure on AWS.
- Collaborate with UI/UX designers and product managers to deliver seamless developer experiences.

REQUIREMENTS:
- 4+ years of full-stack development experience with modern JavaScript/TypeScript ecosystems.
- Deep proficiency in Next.js, React, state management, and modern CSS (Tailwind).
- Demonstrated mastery of Node.js backend services, SQL databases (PostgreSQL), and caching strategies (Redis).
- Experience with Docker, cloud infrastructure (AWS/GCP), and serverless deployments.
- Strong problem-solving abilities and commitment to clean code, testing, and system reliability.`
  },
  {
    id: "product-manager",
    title: "Technical Product Manager",
    role: "Lead AI Product Manager",
    company: "FinTech Innovation Labs",
    badge: "Product & Strategy",
    resume: `SAMANTHA PATEL
New York, NY | samantha.patel@pmmail.com | linkedin.com/in/samanthapatel-pm

EXECUTIVE SUMMARY
Technical Product Manager with 6+ years driving 0-to-1 B2B SaaS and AI-driven workflow products. Expert in product strategy, user discovery, agile lifecycle management, and translating complex machine learning capabilities into high-retention customer value.

SKILLS & COMPETENCIES
- Product Strategy: Roadmap Planning, PRD Writing, 0-to-1 Product Launches, Market & Competitor Analysis, Go-To-Market (GTM)
- Data & Analytics: SQL, Amplitude, Mixpanel, Google Analytics, A/B Testing, User Cohort Retention
- Technical Understanding: REST APIs, LLM applications, System Architecture, Agile/Scrum, Jira, Linear
- Leadership: Cross-functional leadership (Engineering, UX/UI, Sales, Legal, Marketing), Stakeholder Management

EXPERIENCE
Lead Product Manager | FinFlow Technologies | 2022 - Present
- Led the discovery, development, and launch of AI-powered financial fraud detection engine, generating $2.8M ARR in first 12 months.
- Reduced customer onboarding friction by 40% through iterative data-driven experimentation and redesigned user journeys.
- Managed sprint backlogs for 2 engineering pods (14 engineers & 2 designers), maintaining a 94% on-time sprint velocity.

Technical PM | DataVantage Analytics | 2018 - 2022
- Spearheaded enterprise analytics dashboard used by 150+ corporate clients, increasing daily active usage (DAU) by 65%.
- Authored 30+ comprehensive PRDs, technical specs, and wireframes in collaboration with engineering leads.

EDUCATION
B.A. in Economics & Minor in Computer Science | Columbia University | 2014 - 2018`,
    jd: `Title: Principal AI Technical Product Manager
Company: Vanguard AI Innovations
Location: New York, NY

OVERVIEW:
We are hiring a Principal Technical Product Manager to lead our flagship enterprise AI reasoning assistant. You will define product vision, align cross-functional engineering and research teams, and execute high-growth product roadmaps.

RESPONSIBILITIES:
- Own product strategy and end-to-end roadmap for our core AI automation product suite.
- Translate customer workflows into rigorous PRDs, user stories, and acceptance criteria for engineering teams.
- Conduct continuous customer discovery interviews, usability testing, and quantitative funnel analysis.
- Define North Star KPIs and monitor engagement, retention, and model accuracy benchmarks.

REQUIREMENTS:
- 5+ years of Product Management experience in B2B SaaS, developer tools, or AI products.
- Strong technical literacy with ability to engage deeply with AI/ML engineers on system constraints and model evaluation.
- Proven track record of launching successful 0-to-1 software products.
- Mastery of product analytics tools (Amplitude, SQL, Mixpanel) and agile frameworks.`
  }
];
