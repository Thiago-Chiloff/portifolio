import React from 'react';
import { FaCode } from 'react-icons/fa';
import { SiReact, SiJavascript, SiTypescript, SiPython, SiNodedotjs, SiHtml5, SiCss, SiThreedotjs } from 'react-icons/si';
import Header from "../header/header";
import "../../css/projects/projects.css";

const ProjectCard = ({ repo, description, link, techs = [] }) => {
  const getTechIcon = (tech) => {
    const icons = {
      'React': <SiReact color="#61DAFB" />,
      'JavaScript': <SiJavascript color="#F7DF1E" />,
      'TypeScript': <SiTypescript color="#3178C6" />,
      'Python': <SiPython color="#3776AB" />,
      'Node.js': <SiNodedotjs color="#339933" />,
      'HTML': <SiHtml5 color="#E34F26" />,
      'CSS': <SiCss color="#1572B6" />,
      'Three.js': <SiThreedotjs color="#000000" />
    };
    return icons[tech] || <FaCode />;
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title">
          <FaCode className="project-icon" />
          <h3>{repo}</h3>
        </div>
      </div>
      
      <div className="project-content">
        <p className="project-description">{description}</p>
        
        {techs.length > 0 && (
          <div className="project-techs">
            {techs.map((tech, index) => (
              <div key={index} className="tech-tooltip">
                <span className="tech-icon">
                  {getTechIcon(tech)}
                </span>
                <span className="tech-name">{tech}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="project-links">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

function Projects() {
  const projects = [
    {
      repo: "Meu Portfólio",
      description: "Meu portfólio pessoal desenvolvido com React, apresentando meus projetos, habilidades e experiências. Design moderno e responsivo com animações suaves.",
      link: "https://portifolio-virid-alpha-21.vercel.app/",
      techs: ["React", "JavaScript", "CSS"]
    },
    {
      repo: "Anonymous Secrets",
      description: "Um Site/App para compartilhar segredos de forma anônima, gratuita e segura.",
      link: "https://anonymoussecrets.vercel.app/",
      techs: ["React" , "Typescript" , "Supabase" , "CSS"]
    },
    {
        repo: "MineClone",
        description: "Um jogo 3D clone no Minecraft, desenvolvido com React Three Fiber. Explore um mundo gerado proceduralmente, construa estruturas e sobreviva a desafios em um ambiente voxel. (P.S: O jogo é apenas para eu demonstrar meus conhecimentos em React e está neste portifólio como um easter egg, não é um projeto sério, e também perderia a graça se eu falasse onde ele está ;) )",
        link: "https://portifolio-virid-alpha-21.vercel.app/",
        techs: ["React", "Three.js", "JavaScript", "CSS"]
    },
    {
        repo: "PayCount",
        description: "Um aplicativo/site para te lembrar das contas a serem pagas no mês (P.S: O projeto eu fiz exclusivamente para a minha mãe que não sabe mexer no google forms)",
        link: "https://paycount.vercel.app/",
        techs: ["React", "JavaScript", "CSS"]
    },
    {
      repo : "Jogo da Imitação",
      description: [
        "Baseado no famoso teste de Turing, o Jogo da Imitação é um desafio interativo que explora a capacidade de distinguir se a mensagem foi escrita por uma IA ou por um humano, se o jogador acertar que foi uma IA(ou humano) o teste falha e o  jogador ganha, se o jogador errar, o teste passa e a IA vence.",<br/>,
        "O jogador, ao finalizar a partida, pode utilizar os pontos gerados (logs) para comprar itens na loja. " , <br/>,
        "Há um sistema de ranking, onde os jogadores podem comparar suas pontuações com outros jogadores e ver quem é o melhor no Jogo da Imitação."
      ],
      link: "https://theimationgame.vercel.app/",
      techs: ["React", "TypeScript", "CSS" , "Supabase"]
    }
  ];

  return (
    <>
      <Header />
      <div className="projects-page">
        <div className="projects-container">
          <div className="projects-header">
            <h1>Meus Projetos</h1>
            <p className="subtitle">Explore alguns dos meus trabalhos no GitHub</p>
          </div>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                repo={project.repo}
                description={project.description}
                link={project.link}
                techs={project.techs}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;