
 let appliedJobs = [];
 let mockSuggestions = [];
let profile = {
      name: "",
      title: "",
      bio: "",
      skills: [], // Important pour éviter l'erreur .map
      location: "",
      email: "",
      phone: ""
  };

// Fonction pour récupérer les données depuis ton API



      async function fetchDashboardData() {
      try {
            /*const [jobsRes, suggestionsRes, profileRes] = await Promise.all([
                  fetch(`https://eureka-api-ehbed6ggg2d4c7gv.spaincentral-01.azurewebsites.net/api/profiles/profile/${sessionStorage.getItem("UserId")}`), 
            ]);*/


            const profileRes = await fetch(`https://eureka-api-ehbed6ggg2d4c7gv.spaincentral-01.azurewebsites.net/api/profiles/profile/${sessionStorage.getItem("UserId")}`);



            //appliedJobs = await jobsRes.json();
            //mockSuggestions = await suggestionsRes.json();

            console.log(sessionStorage.getItem("UserId"));
            profile = await profileRes.json();

            console.log(profile);

            // Une fois les données reçues, on met à jour l'interface




             appliedJobs = [
                  { id: 1, title: "Développeur Frontend", company: "Mayotte Tech", date: "02 Mars 2024", status: "En cours" },
                  { id: 2, title: "Agent de Maintenance", company: "EDM", date: "28 Fév 2024", status: "Refusé" },
                  { id: 3, title: "Assistant Administratif", company: "Mairie de Mamoudzou", date: "15 Jan 2024", status: "Accepté" },
                  { id: 4, title: "Chargé de Clientèle", company: "Orange Mayotte", date: "10 Jan 2024", status: "En cours" },
            ];

             mockSuggestions = [
                  { id: 1, title: "Développeur Fullstack", company: "Digital Mayotte", location: "Koungou", type: "CDI" },
                  { id: 2, title: "Chef de Projet IT", company: "Eureka Conseils", location: "Mamoudzou", type: "CDD" },
                  { id: 3, title: "Designer UI/UX", company: "Studio Lagon", location: "Petite-Terre", type: "Interim" },
                  { id: 4, title: "Analyste Cyber", company: "Cyber-Island", location: "Mamoudzou", type: "CDI" },
            ];






            initializeApp();
      } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            showToast('Impossible de charger les données du profil', 'error');
      }
}











// fin modificaiton 







let isEditing = false;

// ==================
// UTILITY FUNCTIONS
// ==================

function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast-notification ${type === 'error' ? 'toast-error' : ''}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => {
            toast.remove();
      }, 3000);
}

function getStatusClass(status) {
      const classes = {
            "En cours": "bg-blue-50 text-blue-600 border-blue-100",
            "Accepté": "bg-emerald-50 text-emerald-600 border-emerald-100",
            "Refusé": "bg-red-50 text-red-600 border-red-100"
      };
      return classes[status] || "bg-slate-50 text-slate-600 border-slate-100";
}

// ==================
// RENDER FUNCTIONS
// ==================

function renderHistory() {
      const list = document.getElementById('jobs-list');
      const count = document.getElementById('jobs-count');

      count.textContent = `${appliedJobs.length} ${appliedJobs.length === 1 ? 'Poste' : 'Postes'}`;

      if (appliedJobs.length === 0) {
            list.innerHTML = `
      <div class="flex flex-col items-center justify-center h-64 text-center">
        <i data-lucide="inbox" size="32" class="text-slate-300 mb-3"></i>
        <p class="text-sm text-slate-400 font-medium">Aucune candidature pour le moment</p>
        <p class="text-xs text-slate-300 mt-1">Découvrez des opportunités dans les suggestions !</p>
      </div>
    `;
      } else {
            list.innerHTML = appliedJobs.map((job, index) => `
      <div class="bg-slate-50/50 p-4 rounded-[24px] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group/card job-card animate-slide-in" style="animation-delay: ${index * 50}ms;">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-extrabold text-slate-800 text-sm group-hover/card:text-blue-600 transition-colors leading-tight flex-1">${escapeHtml(job.title)}</h3>
          <span class="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border whitespace-nowrap ml-2 ${getStatusClass(job.status)}">
            ${job.status}
          </span>
        </div>
        <p class="text-[10px] font-bold text-slate-400 mb-3 flex items-center gap-1.5">
          <i data-lucide="building-2" size="11" class="text-slate-300 flex-shrink-0"></i> 
          <span>${escapeHtml(job.company)}</span>
        </p>
        <div class="flex items-center gap-2 text-[9px] font-bold text-slate-300 pt-2 border-t border-slate-100">
          <i data-lucide="clock" size="9"></i> ${job.date}
        </div>
      </div>
    `).join('');
      }
      lucide.createIcons();
}

function renderProfile() {
      const container = document.getElementById('profile-container');
      const footer = document.getElementById('profile-footer');
      const editBtn = document.getElementById('btn-edit-profile');

      if (isEditing) {
            editBtn.innerHTML = '<i data-lucide="check" size="18"></i>';
            editBtn.className = "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90 border bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100";
            editBtn.title = "Enregistrer";
            footer.classList.add('hidden');

            container.innerHTML = `
      <div class="space-y-5 animate-slide-in">
            <div class="space-y-4">
                  <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                        <input id="edit-name" value="${escapeHtml(profile.name)}" class="w-full h-10 px-4 rounded-xl bg-slate-50 border border-transparent focus:outline-none focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium">
                  </div>
                  <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre professionnel</label>
                        <input id="edit-title" value="${escapeHtml(profile.title)}" class="w-full h-10 px-4 rounded-xl bg-slate-50 border border-transparent focus:outline-none focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium">
                  </div>
                  <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Biographie</label>
                        <textarea id="edit-bio" class="w-full rounded-xl bg-slate-50 border border-transparent focus:outline-none focus:bg-white focus:border-emerald-200 transition-all min-h-[100px] text-sm font-medium p-4 resize-none">${escapeHtml(profile.bio)}</textarea>
                  </div>
            </div>

            <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Compétences</label>
                  <div class="flex gap-2 flex-col sm:flex-row">
                        <input id="new-skill-input" placeholder="Ex: TypeScript" class="flex-grow h-10 px-4 rounded-xl bg-slate-50 border border-transparent focus:outline-none focus:bg-white focus:border-emerald-200 transition-all text-sm font-medium">
                              <button onclick="handleAddSkill()" class="h-10 w-full sm:w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white p-0 shadow-lg shadow-emerald-200 flex items-center justify-center cursor-pointer transition-all active:scale-95" title="Ajouter une compétence">
                                    <i data-lucide="plus" size="18"></i>
                              </button>
                  </div>
                  <div class="flex flex-wrap gap-1.5 mt-3">
                        ${profile.skills.map((skill, i) => `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[10px] font-black text-emerald-700 border border-emerald-100 hover:border-red-200 transition-all">
                ${escapeHtml(skill)}
                <button onclick="handleRemoveSkill(${i})" class="text-emerald-300 hover:text-red-500 transition-colors cursor-pointer" title="Supprimer">
                  <i data-lucide="x" size="10"></i>
                </button>
              </span>
            `).join('')}
                  </div>
            </div>
      </div>
      `;
      } else {
            editBtn.innerHTML = '<i data-lucide="edit-2" size="18"></i>';
            editBtn.className = "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90 border bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
            editBtn.title = "Éditer le profil";
            footer.classList.remove('hidden');

            container.innerHTML = `
      <div class="space-y-6 animate-slide-in">
            <div class="bg-slate-50 p-6 rounded-[24px] border border-slate-100 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
                  <h3 class="text-2xl font-extrabold text-slate-900 tracking-tighter leading-none mb-1.5">${escapeHtml(profile.name)}</h3>
                  <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">${escapeHtml(profile.title)}</p>
                  <div class="flex flex-col gap-2.5 text-[10px] font-bold text-slate-500">
                        <div class="flex items-center gap-2">
                              <i data-lucide="map-pin" size="12" class="text-amber-500 flex-shrink-0"></i> ${escapeHtml(profile.location)}
                        </div>
                        <div class="flex items-center gap-2">
                              <i data-lucide="mail" size="12" class="text-amber-500 flex-shrink-0"></i> ${escapeHtml(profile.email)}
                        </div>
                        <div class="flex items-center gap-2">
                              <i data-lucide="phone" size="12" class="text-amber-500 flex-shrink-0"></i> ${escapeHtml(profile.phone)}
                        </div>
                  </div>
            </div>

            <div class="space-y-2.5">
                  <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Biographie</h4>
                  <p class="text-xs text-slate-600 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-slate-100 shadow-sm italic">
                        "${escapeHtml(profile.bio)}"
                  </p>
            </div>

            <div class="space-y-2.5">
                  <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Compétences clés</h4>
                  <div class="flex flex-wrap gap-1.5">
                        ${profile.skills.map((skill, i) => `
              <span class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-amber-700 border border-transparent shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:border-amber-100 group/skill">
                ${escapeHtml(skill)}
              </span>
            `).join('')}
                  </div>
            </div>
      </div>
      `;
      }
      lucide.createIcons();
}

function renderSuggestions() {
      const list = document.getElementById('suggestions-list');
      list.innerHTML = mockSuggestions.map((job, index) => `
      <div class="bg-slate-50/50 p-5 rounded-[24px] border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group/card job-card animate-slide-in" style="animation-delay: ${index * 50}ms;">
            <div class="flex justify-between items-start mb-3">
                  <div class="flex flex-col gap-1 flex-1">
                        <h3 class="font-extrabold text-slate-800 text-sm leading-tight group-hover/card:text-emerald-600 transition-colors">${escapeHtml(job.title)}</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                              <i data-lucide="building-2" size="11" class="text-slate-300 flex-shrink-0"></i> ${escapeHtml(job.company)}
                        </p>
                  </div>
                  <span class="text-[8px] font-black tracking-widest px-2 py-0.5 bg-white text-emerald-700 rounded-full uppercase border border-emerald-100 shadow-sm whitespace-nowrap ml-2">
                        ${job.type}
                  </span>
            </div>

            <div class="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 border-b border-slate-100/50 pb-3">
                  <div class="flex items-center gap-1.5">
                        <i data-lucide="map-pin" size="12" class="text-emerald-500 flex-shrink-0"></i> ${escapeHtml(job.location)}
                  </div>
            </div>

            <button
                  onclick="handleApply('${escapeHtml(job.title).replace(/'/g, "\\'")}', '${escapeHtml(job.company).replace(/'/g, "\\'")}')"
            class="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-none font-black uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95 group-hover/card:scale-[1.02] transform text-[10px] cursor-pointer"
            title="Envoyer une candidature"
      >
            Candidature Rapide
      </button>
</div>
`).join('');
      lucide.createIcons();
}

// ==================
// EVENT HANDLERS
// ==================

function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
}

document.getElementById('btn-edit-profile').addEventListener('click', () => {
      if (isEditing) {
            const name = document.getElementById('edit-name').value.trim();
            const title = document.getElementById('edit-title').value.trim();
            const bio = document.getElementById('edit-bio').value.trim();

            if (!name || !title || !bio) {
                  showToast('Veuillez remplir tous les champs', 'error');
                  return;
            }

            profile.name = name;
            profile.title = title;
            profile.bio = bio;
            showToast('Profil mis à jour avec succès !');
      }
      isEditing = !isEditing;
      renderProfile();
});

function handleApply(title, company) {
      const today = new Date();
      const dateStr = today.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
      });

      const newJob = {
            id: Date.now(),
            title: title,
            company: company,
            date: dateStr,
            status: "En cours"
      };

      appliedJobs.unshift(newJob);
      renderHistory();
      showToast(`Candidature envoyée pour "${title}" chez ${company} !`);
}

function handleRemoveSkill(index) {
      profile.skills.splice(index, 1);
      renderProfile();
}

function handleAddSkill() {
      const input = document.getElementById('new-skill-input');
      const val = input.value.trim();

      if (!val) {
            showToast('Veuillez entrer une compétence', 'error');
            return;
      }

      if (profile.skills.includes(val)) {
            showToast('Cette compétence existe déjà', 'error');
            return;
      }

      if (profile.skills.length >= 10) {
            showToast('Maximum 10 compétences', 'error');
            return;
      }

      profile.skills.push(val);
      input.value = '';
      renderProfile();
}

function handleBookConsultation() {
      showToast('Réservation d\'une consultation en cours...');
      setTimeout(() => {
            showToast('Un conseiller vous contactera bientôt !');
      }, 1500);
}

// ==================
// TAB MANAGEMENT
// ==================

function switchTab(tabName) {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
      });

      // Remove active class from all buttons
      document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
      });

      // Show selected tab
      const tabId = `tab-${tabName} `;
      const tab = document.getElementById(tabId);
      if (tab) {
            tab.classList.add('active');
      }

      // Highlight selected button
      const buttons = document.querySelectorAll('.tab-button');
      const buttonIndex = {
            'history': 0,
            'profile': 1,
            'suggestions': 2
      };
      if (buttonIndex[tabName] !== undefined) {
            buttons[buttonIndex[tabName]].classList.add('active');
      }

      // Recreate icons in the new active tab
      setTimeout(() => {
            lucide.createIcons();
      }, 0);
}

// ==================
// KEYBOARD SHORTCUTS
// ==================

document.addEventListener('keydown', (e) => {
      if (isEditing && e.key === 'Enter' && e.ctrlKey) {
            document.getElementById('btn-edit-profile').click();
      }
      if (isEditing && e.key === 'Escape') {
            isEditing = false;
            renderProfile();
      }
});

document.addEventListener('keydown', (e) => {
      if (isEditing && e.id === 'new-skill-input' && e.key === 'Enter') {
            handleAddSkill();
      }
});

// ==================
// INITIALIZATION
// ==================



document.addEventListener('DOMContentLoaded', initializeApp);

// If DOM is already loaded
if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
} else {
      initializeApp();
}



// initialisation 

async function initializeApp() {
      // Si les données sont vides, on les charge d'abord
      if (appliedJobs.length === 0) {
            await fetchDashboardData();
            return; // L'appel fetch appellera initializeApp à nouveau
      }

      renderHistory();
      renderProfile();
      renderSuggestions();
      lucide.createIcons();

}

