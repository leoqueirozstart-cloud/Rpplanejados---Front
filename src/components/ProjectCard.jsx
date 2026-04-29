import { Link } from 'react-router-dom';

function ProjectCard({ project }) {
  const getCategoryLabel = (category) => {
    const labels = {
      'moveis-planejados': 'Móveis Planejados',
      'cozinhas': 'Cozinhas',
      'quartos': 'Quartos',
      'escritorios': 'Escritórios',
      'painéis': 'Painéis',
      'decoracao': 'Decoração'
    };
    return labels[category] || category;
  };

  return (
    <Link to={`/projeto/${project.id}`} className="project-card group">
      <div className="project-card-image relative">
        <img src={project.coverImageUrl || '/placeholder.jpg'} alt={project.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-4 right-4 badge badge-primary">
          {getCategoryLabel(project.category)}
        </span>
      </div>
      <div className="project-card-content">
        <h3 className="project-card-title group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="project-card-desc line-clamp-2">
          {project.description}
        </p>
        <div className="project-card-footer">
          <span className="text-xs text-gray-500">
            {project.imageUrls?.length || 0} fotos
          </span>
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Ver projeto 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;