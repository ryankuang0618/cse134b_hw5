/**
 * ProjectCard Web Component
 * A custom element for displaying project information with consistent styling
 */
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['data-title', 'data-image', 'data-description', 'data-link', 'data-tech', 'data-role', 'data-date'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('data-title') || 'Project Title';
    const image = this.getAttribute('data-image') || '';
    const description = this.getAttribute('data-description') || 'No description available.';
    const link = this.getAttribute('data-link') || '#';
    const tech = this.getAttribute('data-tech') || '';
    const role = this.getAttribute('data-role') || '';
    const date = this.getAttribute('data-date') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--background-color, #ffffff);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: var(--border-radius, 0.5rem);
          padding: var(--spacing-lg, 1.5rem);
          box-shadow: var(--box-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
          transition: all var(--transition-base, 0.3s ease-in-out);
          position: relative;
          overflow: hidden;
        }

        :host::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color, #2563eb), var(--accent-color, #f59e0b));
          transform: scaleX(0);
          transition: transform var(--transition-base, 0.3s ease-in-out);
        }

        :host(:hover) {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }

        :host(:hover)::before {
          transform: scaleX(1);
        }

        .card-header {
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: var(--text-color, #1e293b);
          line-height: 1.3;
        }

        .meta-info {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--secondary-color, #64748b);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: var(--background-color-fallback, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-color, #1e293b);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .project-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0.5rem;
          opacity: 0;
          transition: opacity 0.4s ease-in;
        }

        .project-image.loaded {
          opacity: 1;
        }

        .project-image.error {
          opacity: 0.5;
          object-fit: contain;
        }

        .image-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          opacity: 0.3;
        }

        .image-container[data-hidden="true"] {
          display: none;
        }

        .description {
          color: var(--text-color, #1e293b);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: var(--background-color-fallback, #f8fafc);
          border-radius: 0.5rem;
          border-left: 3px solid var(--primary-color, #2563eb);
        }

        .detail-item {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-label {
          font-weight: 600;
          color: var(--text-color, #1e293b);
          min-width: 80px;
        }

        .detail-value {
          color: var(--secondary-color, #64748b);
        }

        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, var(--primary-color, #2563eb), var(--secondary-color, #64748b));
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all var(--transition-base, 0.3s ease-in-out);
          font-size: 0.875rem;
        }

        .project-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .project-link::after {
          content: '→';
          transition: transform var(--transition-base, 0.3s ease-in-out);
        }

        .project-link:hover::after {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          :host {
            padding: 1rem;
          }

          h2 {
            font-size: 1.25rem;
          }

          .project-image {
            height: 150px;
          }
        }

        @media (prefers-color-scheme: dark) {
          :host {
            background: #1e293b;
            border-color: #334155;
          }

          h2 {
            color: #f1f5f9;
          }

          .description {
            color: #e2e8f0;
          }

          .badge {
            background: #334155;
            border-color: #475569;
            color: #f1f5f9;
          }

          .details {
            background: #0f172a;
          }

          .detail-label {
            color: #f1f5f9;
          }

          .detail-value {
            color: #94a3b8;
          }
        }
      </style>

      <article class="project-card" role="article" aria-label="${title}">
        <div class="card-header">
          <h2>${title}</h2>
          ${date ? `<div class="meta-info"><span class="meta-item">📅 ${date}</span></div>` : ''}
        </div>

        ${image ? `
          <div class="image-container" data-hidden="${!image}">
            <div class="image-placeholder">🖼️</div>
            <img 
              data-src="${image}" 
              alt="${title} project screenshot" 
              class="project-image"
              loading="lazy"
              decoding="async"
            >
          </div>
        ` : ''}

        <p class="description">${description}</p>

        ${tech || role ? `
          <div class="details">
            ${tech ? `<div class="detail-item"><span class="detail-label">Tech Stack:</span><span class="detail-value">${tech}</span></div>` : ''}
            ${role ? `<div class="detail-item"><span class="detail-label">Role:</span><span class="detail-value">${role}</span></div>` : ''}
          </div>
        ` : ''}

        ${link !== '#' ? `<a href="${link}" class="project-link" target="_blank" rel="noopener noreferrer">View Project</a>` : ''}
      </article>
    `;

    this.setupLazyLoading();
  }

  setupLazyLoading() {
    const img = this.shadowRoot.querySelector('.project-image');
    if (!img) return;

    const imageSrc = img.getAttribute('data-src');
    if (!imageSrc) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            this.loadImage(image, imageSrc);
            observer.unobserve(image);
          }
        });
      }, {
        rootMargin: '50px'
      });

      imageObserver.observe(img);
    } else {
      this.loadImage(img, imageSrc);
    }
  }

  loadImage(img, src) {
    const tempImg = new Image();
    
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      const placeholder = this.shadowRoot.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      const container = this.shadowRoot.querySelector('.image-container');
      if (container) {
        container.style.animation = 'none';
        container.style.background = 'transparent';
      }
    };

    tempImg.onerror = () => {
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18"%3EImage not found%3C/text%3E%3C/svg%3E';
      img.classList.add('loaded', 'error');
      const placeholder = this.shadowRoot.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.textContent = '❌';
      }
      const container = this.shadowRoot.querySelector('.image-container');
      if (container) {
        container.style.animation = 'none';
        container.style.background = '#f8f8f8';
      }
    };

    tempImg.src = src;
  }
}

// Register the custom element
customElements.define('project-card', ProjectCard);

