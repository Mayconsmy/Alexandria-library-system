const SKIN_COLORS = [
  { value: '#f5cba7', label: 'Claro' },
  { value: '#deb887', label: 'Médio' },
  { value: '#c68642', label: 'Moreno' },
  { value: '#8d5524', label: 'Escuro' },
  { value: '#5c3317', label: 'Negro' },
];

const HAIR_COLORS = [
  { value: '#000000', label: 'Preto' },
  { value: '#4a3728', label: 'Castanho' },
  { value: '#b5651d', label: 'Loiro' },
  { value: '#c0392b', label: 'Ruivo' },
  { value: '#888888', label: 'Cinza' },
];

const HAIR_STYLES = [
  { value: 'short', label: 'Curto' },
  { value: 'long', label: 'Longo' },
  { value: 'curly', label: 'Cacheado' },
  { value: 'ponytail', label: 'Rabito' },
  { value: 'bald', label: 'Careca' },
];

const EYE_COLORS = [
  { value: '#4a90d9', label: 'Azul' },
  { value: '#2e7d32', label: 'Verde' },
  { value: '#5d4037', label: 'Castanho' },
  { value: '#000000', label: 'Preto' },
];

const ACCESSORIES = [
  { value: 'none', label: 'Nenhum' },
  { value: 'glasses', label: 'Óculos' },
  { value: 'sunglasses', label: 'Óculos escuro' },
];

const DEFAULT_AVATAR = {
  skin: '#f5cba7',
  hair: '#000000',
  hairStyle: 'short',
  eyes: '#4a90d9',
  gender: 'male',
  accessory: 'none',
};

function getAvatarConfig(fotoPerfil) {
  if (!fotoPerfil) return { ...DEFAULT_AVATAR };
  try {
    const parsed = JSON.parse(fotoPerfil);
    return { ...DEFAULT_AVATAR, ...parsed };
  } catch {
    return { ...DEFAULT_AVATAR, url: fotoPerfil };
  }
}

function renderAvatarSVG(config, size) {
  if (config.url) {
    return `<img src="${escapeHtml(config.url)}" alt="Avatar" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
  }

  const skin = config.skin;
  const hair = config.hair;
  const eyes = config.eyes;
  const gender = config.gender;
  const style = config.hairStyle;
  const acc = config.accessory;

  let hairSVG = '';
  if (style === 'short') {
    hairSVG = `<path d="M15,35 Q15,8 50,5 Q85,8 85,35 Q85,28 50,26 Q15,28 15,35" fill="${hair}"/>`;
  } else if (style === 'long') {
    hairSVG = `<path d="M15,33 Q15,3 50,3 Q85,3 85,33 Q85,23 50,21 Q15,23 15,33" fill="${hair}"/>
               <path d="M18,38 Q14,65 16,82 Q20,65 23,38" fill="${hair}"/>
               <path d="M82,38 Q86,65 84,82 Q80,65 77,38" fill="${hair}"/>`;
  } else if (style === 'curly') {
    hairSVG = `<circle cx="22" cy="22" r="11" fill="${hair}"/>
               <circle cx="50" cy="12" r="14" fill="${hair}"/>
               <circle cx="78" cy="22" r="11" fill="${hair}"/>
               <circle cx="33" cy="15" r="10" fill="${hair}"/>
               <circle cx="67" cy="15" r="10" fill="${hair}"/>`;
  } else if (style === 'ponytail') {
    hairSVG = `<path d="M15,33 Q15,3 50,3 Q85,3 85,33 Q85,23 50,21 Q15,23 15,33" fill="${hair}"/>
               <ellipse cx="85" cy="62" rx="13" ry="22" fill="${hair}"/>`;
  }

  let earrings = '';
  if (gender === 'female') {
    earrings = `<circle cx="13" cy="46" r="4" fill="#f1c40f"/><circle cx="87" cy="46" r="4" fill="#f1c40f"/>`;
  }

  let mouth = '';
  if (gender === 'male') {
    mouth = `<path d="M36,56 Q50,61 64,56" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>`;
  } else {
    mouth = `<path d="M33,56 Q50,64 67,56" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>`;
  }

  let accSVG = '';
  if (acc === 'glasses') {
    accSVG = `<rect x="27" y="33" width="17" height="13" rx="3" fill="none" stroke="#333" stroke-width="1.5"/>
              <rect x="56" y="33" width="17" height="13" rx="3" fill="none" stroke="#333" stroke-width="1.5"/>
              <line x1="44" y1="39.5" x2="56" y2="39.5" stroke="#333" stroke-width="1.5"/>`;
  } else if (acc === 'sunglasses') {
    accSVG = `<rect x="25" y="35" width="21" height="12" rx="3" fill="#222"/>
              <rect x="54" y="35" width="21" height="12" rx="3" fill="#222"/>
              <line x1="46" y1="41" x2="54" y2="41" stroke="#222" stroke-width="2"/>`;
  }

  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}">
    ${hairSVG}
    <ellipse cx="50" cy="46" rx="34" ry="36" fill="${skin}"/>
    ${earrings}
    <circle cx="35" cy="39" r="4.5" fill="${eyes}"/>
    <circle cx="65" cy="39" r="4.5" fill="${eyes}"/>
    <circle cx="37" cy="38" r="1.5" fill="#fff"/>
    <circle cx="63" cy="38" r="1.5" fill="#fff"/>
    ${mouth}
    ${accSVG}
  </svg>`;
}

function renderAvatar(container, config, size) {
  if (typeof container === 'string') container = document.getElementById(container);
  const svg = renderAvatarSVG(config, size || 96);
  container.innerHTML = svg;
}

function renderAvatarOptions(containerId, currentConfig, onChange) {
  const cfg = currentConfig || { ...DEFAULT_AVATAR };
  const container = document.getElementById(containerId);

  function renderOptions() {
    const preview = renderAvatarSVG(cfg, 120);

    container.innerHTML = `
      <div class="avatar-builder">
        <div class="avatar-preview-wrap">${preview}</div>

        <div class="avatar-option-group">
          <label>Gênero</label>
          <div class="avatar-btn-group">
            <button class="avatar-btn ${cfg.gender === 'male' ? 'active' : ''}" data-key="gender" data-value="male">Masculino</button>
            <button class="avatar-btn ${cfg.gender === 'female' ? 'active' : ''}" data-key="gender" data-value="female">Feminino</button>
          </div>
        </div>

        <div class="avatar-option-group">
          <label>Pele</label>
          <div class="avatar-swatches">
            ${SKIN_COLORS.map(c => `
              <button class="avatar-swatch ${cfg.skin === c.value ? 'active' : ''}" style="background:${c.value}" data-key="skin" data-value="${c.value}" title="${c.label}"></button>
            `).join('')}
          </div>
        </div>

        <div class="avatar-option-group">
          <label>Cabelo</label>
          <div class="avatar-btn-group">
            ${HAIR_STYLES.map(h => `
              <button class="avatar-btn ${cfg.hairStyle === h.value ? 'active' : ''}" data-key="hairStyle" data-value="${h.value}">${h.label}</button>
            `).join('')}
          </div>
          <div class="avatar-swatches" style="margin-top:8px">
            ${HAIR_COLORS.map(c => `
              <button class="avatar-swatch ${cfg.hair === c.value ? 'active' : ''}" style="background:${c.value}" data-key="hair" data-value="${c.value}" title="${c.label}"></button>
            `).join('')}
          </div>
        </div>

        <div class="avatar-option-group">
          <label>Olhos</label>
          <div class="avatar-swatches">
            ${EYE_COLORS.map(c => `
              <button class="avatar-swatch ${cfg.eyes === c.value ? 'active' : ''}" style="background:${c.value}" data-key="eyes" data-value="${c.value}" title="${c.label}"></button>
            `).join('')}
          </div>
        </div>

        <div class="avatar-option-group">
          <label>Acessórios</label>
          <div class="avatar-btn-group">
            ${ACCESSORIES.map(a => `
              <button class="avatar-btn ${cfg.accessory === a.value ? 'active' : ''}" data-key="accessory" data-value="${a.value}">${a.label}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const value = btn.dataset.value;
        cfg[key] = value;
        if (onChange) onChange(cfg);
        renderOptions();
      });
    });
  }

  renderOptions();
  return cfg;
}
