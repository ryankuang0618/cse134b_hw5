/**
 * Projects Data Loader
 * Handles loading project data from localStorage and remote server
 */

const ProjectsLoader = {
  // Configuration
  LOCAL_STORAGE_KEY: 'projectsData',
  REMOTE_URL: 'https://my-json-server.typicode.com/ryankuang0618/cse134b_hw5/projects',
  
  /**
   * Initialize the loader and set up event listeners
   */
  init() {
    this.container = document.getElementById('projects-container');
    this.loadLocalBtn = document.getElementById('load-local-btn');
    this.loadRemoteBtn = document.getElementById('load-remote-btn');
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.statusDisplay = document.getElementById('data-status');

    if (!this.container || !this.loadLocalBtn || !this.loadRemoteBtn) {
      console.error('Required elements not found');
      return;
    }

    // Set up event listeners
    this.loadLocalBtn.addEventListener('click', () => this.loadLocal());
    this.loadRemoteBtn.addEventListener('click', () => this.loadRemote());

    // Initialize localStorage with default data if empty
    this.initializeLocalStorage();
  },

  /**
   * Initialize localStorage with data from projects-local.json
   */
  initializeLocalStorage() {
    const existingData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!existingData) {
      // Fetch the local JSON file and store it
      this.fetchLocalJSON();
    }
  },

  /**
   * Fetch local JSON file and store in localStorage
   */
  fetchLocalJSON() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'projects-local.json', true);
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data.projects));
          console.log('Local data initialized in localStorage');
        } catch (error) {
          console.error('Error parsing local JSON:', error);
        }
      } else {
        console.error('Failed to load local JSON file:', xhr.status);
      }
    };

    xhr.onerror = () => {
      console.error('Error fetching local JSON file');
    };

    xhr.send();
  },

  /**
   * Load projects from localStorage
   */
  loadLocal() {
    this.showLoading(true);
    this.updateStatus('Loading projects from local storage...', 'info');
    this.disableButtons(true);

    // Simulate async operation
    setTimeout(() => {
      try {
        const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        
        if (!data) {
          this.updateStatus('No local data found. Initializing...', 'error');
          this.initializeLocalStorage();
          // Try again after initialization
          setTimeout(() => this.loadLocal(), 500);
          return;
        }

        const projects = JSON.parse(data);
        this.renderProjects(projects);
        this.updateStatus(`✓ Successfully loaded ${projects.length} projects from local storage`, 'success');
        this.showLoading(false);
        this.disableButtons(false);
      } catch (error) {
        console.error('Error loading local data:', error);
        this.updateStatus('❌ Error loading local data: ' + error.message, 'error');
        this.showLoading(false);
        this.disableButtons(false);
      }
    }, 500);
  },

  /**
   * Load projects from remote server using XMLHttpRequest
   */
  loadRemote() {
    this.showLoading(true);
    this.updateStatus('Loading projects from remote server...', 'info');
    this.disableButtons(true);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.REMOTE_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      this.showLoading(false);
      this.disableButtons(false);

      if (xhr.status === 200) {
        try {
          const projects = JSON.parse(xhr.responseText);
          
          if (Array.isArray(projects) && projects.length > 0) {
            this.renderProjects(projects);
            this.updateStatus(`✓ Successfully loaded ${projects.length} projects from remote server`, 'success');
          } else {
            this.updateStatus('❌ No projects found on remote server', 'error');
          }
        } catch (error) {
          console.error('Error parsing remote data:', error);
          this.updateStatus('❌ Error parsing remote data: ' + error.message, 'error');
        }
      } else {
        this.updateStatus(`❌ Failed to load remote data (Status: ${xhr.status})`, 'error');
        console.error('Remote request failed:', xhr.status, xhr.statusText);
      }
    };

    xhr.onerror = () => {
      this.showLoading(false);
      this.disableButtons(false);
      this.updateStatus('❌ Network error: Could not connect to remote server', 'error');
      console.error('Network error occurred');
    };

    xhr.ontimeout = () => {
      this.showLoading(false);
      this.disableButtons(false);
      this.updateStatus('❌ Request timeout: Server took too long to respond', 'error');
    };

    // Set timeout to 10 seconds
    xhr.timeout = 10000;
    xhr.send();
  },

  /**
   * Render projects to the DOM
   * @param {Array} projects - Array of project objects
   */
  renderProjects(projects) {
    // Clear existing content
    this.container.innerHTML = '';

    if (!projects || projects.length === 0) {
      this.container.innerHTML = '<p style="text-align: center; color: var(--secondary-color); padding: 2rem;">No projects to display.</p>';
      return;
    }

    // Create and append project cards
    projects.forEach((project, index) => {
      const card = document.createElement('project-card');
      
      // Set attributes
      card.setAttribute('data-title', project.title || 'Untitled Project');
      
      if (project.image) {
        card.setAttribute('data-image', project.image);
      }
      
      card.setAttribute('data-description', project.description || 'No description available.');
      
      if (project.link) {
        card.setAttribute('data-link', project.link);
      }
      
      if (project.tech) {
        card.setAttribute('data-tech', project.tech);
      }
      
      if (project.role) {
        card.setAttribute('data-role', project.role);
      }
      
      if (project.date) {
        card.setAttribute('data-date', project.date);
      }

      // Store project ID for CRUD operations
      if (project.id) {
        card.setAttribute('data-id', project.id);
      }

      // Add animation delay for staggered appearance
      card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;

      this.container.appendChild(card);
    });
  },

  /**
   * Show/hide loading indicator
   * @param {boolean} show - Whether to show the loading indicator
   */
  showLoading(show) {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = show ? 'block' : 'none';
    }
  },

  /**
   * Update status message
   * @param {string} message - Status message to display
   * @param {string} type - Type of message ('info', 'success', 'error')
   */
  updateStatus(message, type = 'info') {
    if (!this.statusDisplay) return;

    this.statusDisplay.textContent = message;
    this.statusDisplay.style.color = 
      type === 'success' ? '#16a34a' :
      type === 'error' ? '#dc2626' :
      'var(--secondary-color)';
  },

  /**
   * Enable/disable load buttons
   * @param {boolean} disabled - Whether to disable the buttons
   */
  disableButtons(disabled) {
    if (this.loadLocalBtn) {
      this.loadLocalBtn.disabled = disabled;
    }
    if (this.loadRemoteBtn) {
      this.loadRemoteBtn.disabled = disabled;
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ProjectsLoader.init();
});

// Export for use in CRUD operations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectsLoader;
}

