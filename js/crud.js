const ProjectCRUD = {
  LOCAL_STORAGE_KEY: 'projectsData',
  REMOTE_URL: 'https://my-json-server.typicode.com/ryankuang0618/cse134b_hw5/projects',
  currentSource: 'local',

  init() {
    this.createForm = document.getElementById('create-form');
    this.updateForm = document.getElementById('update-form');
    this.selectProject = document.getElementById('select-project');
    this.deleteBtn = document.getElementById('delete-btn');
    this.statusMessage = document.getElementById('status-message');
    this.projectsDisplay = document.getElementById('projects-display');
    this.sourceLocalBtn = document.getElementById('source-local-btn');
    this.sourceRemoteBtn = document.getElementById('source-remote-btn');
    this.currentSourceDisplay = document.getElementById('current-source');

    this.initializeStorage();
    this.setupEventListeners();
    this.loadProjects();
  },

  initializeStorage() {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (!data) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'projects-local.json', false);
      xhr.send();
      
      if (xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(jsonData.projects));
      }
    }
  },

  setupEventListeners() {
    if (this.createForm) {
      this.createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createProject();
      });
    }

    if (this.updateForm) {
      this.updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateProject();
      });
    }

    if (this.selectProject) {
      this.selectProject.addEventListener('change', (e) => {
        this.loadProjectForEdit(e.target.value);
      });
    }

    if (this.deleteBtn) {
      this.deleteBtn.addEventListener('click', () => {
        this.deleteProject();
      });
    }

    if (this.sourceLocalBtn) {
      this.sourceLocalBtn.addEventListener('click', () => {
        this.switchSource('local');
      });
    }

    if (this.sourceRemoteBtn) {
      this.sourceRemoteBtn.addEventListener('click', () => {
        this.switchSource('remote');
      });
    }
  },

  switchSource(source) {
    this.currentSource = source;
    
    if (source === 'local') {
      this.sourceLocalBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
      this.sourceLocalBtn.style.opacity = '1';
      this.sourceRemoteBtn.style.background = 'linear-gradient(135deg, #2563eb, #60a5fa)';
      this.sourceRemoteBtn.style.opacity = '0.6';
      this.currentSourceDisplay.textContent = '(Using Local)';
      this.showMessage('✓ Switched to Local Storage', 'success');
    } else {
      this.sourceLocalBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
      this.sourceLocalBtn.style.opacity = '0.6';
      this.sourceRemoteBtn.style.background = 'linear-gradient(135deg, #2563eb, #60a5fa)';
      this.sourceRemoteBtn.style.opacity = '1';
      this.currentSourceDisplay.textContent = '(Using Remote - Read Only)';
      this.showMessage('ℹ️ Switched to Remote Server (Note: Changes are simulated)', 'info');
    }
    
    this.loadProjects();
    this.clearUpdateForm();
    this.selectProject.value = '';
  },

  loadProjects() {
    if (this.currentSource === 'local') {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const projects = data ? JSON.parse(data) : [];
      this.displayProjects(projects);
      this.populateSelectDropdown(projects);
    } else {
      this.loadRemoteProjects();
    }
  },

  loadRemoteProjects() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.REMOTE_URL, true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const projects = JSON.parse(xhr.responseText);
          this.displayProjects(projects);
          this.populateSelectDropdown(projects);
        } catch (error) {
          this.showMessage('❌ Error loading remote data', 'error');
        }
      } else {
        this.showMessage('❌ Failed to load remote data', 'error');
      }
    };

    xhr.onerror = () => {
      this.showMessage('❌ Network error', 'error');
    };

    xhr.send();
  },

  displayProjects(projects) {
    if (!this.projectsDisplay) return;

    this.projectsDisplay.innerHTML = '';

    if (projects.length === 0) {
      this.projectsDisplay.innerHTML = `
        <p style="text-align: center; color: var(--secondary-color); padding: var(--spacing-xl);">
          No projects found. Create your first project above!
        </p>
      `;
      return;
    }

    projects.forEach(project => {
      const item = document.createElement('div');
      item.className = 'project-item';
      item.innerHTML = `
        <div class="project-info">
          <strong>${project.title}</strong>
          <small>${project.tech || 'No tech specified'} • ${project.role || 'No role specified'}</small>
        </div>
      `;
      this.projectsDisplay.appendChild(item);
    });
  },

  populateSelectDropdown(projects) {
    if (!this.selectProject) return;

    this.selectProject.innerHTML = '<option value="">-- Choose a project --</option>';

    projects.forEach((project, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = project.title;
      this.selectProject.appendChild(option);
    });
  },

  createProject() {
    const formData = new FormData(this.createForm);
    const newProject = {
      id: Date.now(),
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image') || '',
      tech: formData.get('tech') || '',
      role: formData.get('role') || '',
      date: formData.get('date') || '',
      link: formData.get('link') || ''
    };

    if (this.currentSource === 'local') {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const projects = data ? JSON.parse(data) : [];

      projects.push(newProject);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(projects));

      this.createForm.reset();
      this.loadProjects();
      this.showMessage(`✓ Project "${newProject.title}" created in Local Storage!`, 'success');
    } else {
      this.simulateRemoteCreate(newProject);
      this.createForm.reset();
      this.showMessage(`ℹ️ Project "${newProject.title}" sent to remote server (simulated)`, 'info');
    }
  },

  simulateRemoteCreate(project) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.REMOTE_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        console.log('Remote POST successful (simulated):', xhr.responseText);
      }
    };

    xhr.send(JSON.stringify(project));
  },

  loadProjectForEdit(index) {
    if (index === '') {
      this.clearUpdateForm();
      return;
    }

    if (this.currentSource === 'local') {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const projects = data ? JSON.parse(data) : [];
      const project = projects[parseInt(index)];

      if (!project) return;

      document.getElementById('update-title').value = project.title || '';
      document.getElementById('update-description').value = project.description || '';
      document.getElementById('update-image').value = project.image || '';
      document.getElementById('update-tech').value = project.tech || '';
      document.getElementById('update-role').value = project.role || '';
      document.getElementById('update-date').value = project.date || '';
      document.getElementById('update-link').value = project.link || '';
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.REMOTE_URL, false);
      xhr.send();
      
      if (xhr.status === 200) {
        const projects = JSON.parse(xhr.responseText);
        const project = projects[parseInt(index)];
        
        if (!project) return;
        
        document.getElementById('update-title').value = project.title || '';
        document.getElementById('update-description').value = project.description || '';
        document.getElementById('update-image').value = project.image || '';
        document.getElementById('update-tech').value = project.tech || '';
        document.getElementById('update-role').value = project.role || '';
        document.getElementById('update-date').value = project.date || '';
        document.getElementById('update-link').value = project.link || '';
      }
    }
  },

  clearUpdateForm() {
    if (this.updateForm) {
      this.updateForm.reset();
    }
  },

  updateProject() {
    const selectedIndex = this.selectProject.value;
    
    if (selectedIndex === '') {
      this.showMessage('❌ Please select a project to update', 'error');
      return;
    }

    const formData = new FormData(this.updateForm);
    const updatedProject = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image') || '',
      tech: formData.get('tech') || '',
      role: formData.get('role') || '',
      date: formData.get('date') || '',
      link: formData.get('link') || ''
    };

    if (this.currentSource === 'local') {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const projects = data ? JSON.parse(data) : [];

      const index = parseInt(selectedIndex);
      updatedProject.id = projects[index].id;
      projects[index] = updatedProject;

      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(projects));

      this.loadProjects();
      this.showMessage(`✓ Project "${updatedProject.title}" updated in Local Storage!`, 'success');
    } else {
      updatedProject.id = Date.now();
      this.simulateRemoteUpdate(updatedProject);
      this.showMessage(`ℹ️ Project "${updatedProject.title}" update sent to remote (simulated)`, 'info');
    }
  },

  simulateRemoteUpdate(project) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${this.REMOTE_URL}/${project.id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('Remote PUT successful (simulated):', xhr.responseText);
      }
    };

    xhr.send(JSON.stringify(project));
  },

  deleteProject() {
    const selectedIndex = this.selectProject.value;
    
    if (selectedIndex === '') {
      this.showMessage('❌ Please select a project to delete', 'error');
      return;
    }

    let projectToDelete;

    if (this.currentSource === 'local') {
      const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      const projects = data ? JSON.parse(data) : [];

      const index = parseInt(selectedIndex);
      projectToDelete = projects[index];

      const confirmed = confirm(`Are you sure you want to delete "${projectToDelete.title}"?`);
      
      if (!confirmed) return;

      projects.splice(index, 1);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(projects));

      this.clearUpdateForm();
      this.selectProject.value = '';
      this.loadProjects();
      this.showMessage(`✓ Project "${projectToDelete.title}" deleted from Local Storage!`, 'success');
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.REMOTE_URL, false);
      xhr.send();
      
      if (xhr.status === 200) {
        const projects = JSON.parse(xhr.responseText);
        projectToDelete = projects[parseInt(selectedIndex)];
        
        const confirmed = confirm(`Are you sure you want to delete "${projectToDelete.title}" from remote?`);
        if (!confirmed) return;
        
        this.simulateRemoteDelete(projectToDelete.id);
        this.clearUpdateForm();
        this.selectProject.value = '';
        this.showMessage(`ℹ️ Delete request sent to remote server (simulated)`, 'info');
      }
    }
  },

  simulateRemoteDelete(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${this.REMOTE_URL}/${id}`, true);

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        console.log('Remote DELETE successful (simulated)');
      }
    };

    xhr.send();
  },

  showMessage(message, type = 'info') {
    if (!this.statusMessage) return;

    this.statusMessage.textContent = message;
    this.statusMessage.className = type;

    setTimeout(() => {
      this.statusMessage.style.display = 'none';
      setTimeout(() => {
        this.statusMessage.className = '';
        this.statusMessage.textContent = '';
      }, 300);
    }, 5000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ProjectCRUD.init();
});

