import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
import elkLayouts from 'https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk/dist/mermaid-layout-elk.esm.min.mjs';

const diagramConfig = {
  fitPadding: 28,
  minHeight: 420,
  maxHeightPx: 900,
  maxHeightVh: 0.82,
  maxInitialZoom: 1.75,
  minZoom: 0.08,
  maxZoom: 6.5,
  zoomStep: 0.14,
  readabilityFloor: 0.58,
};

const clamp = (number, lower, upper) => Math.max(lower, Math.min(upper, number));
let activeDrag = null;

addEventListener('mousemove', (event) => activeDrag?.onMove(event));
addEventListener('mouseup', () => {
  activeDrag?.onEnd();
  activeDrag = null;
});

const isDark = document.documentElement.dataset.theme === 'dark';

mermaid.registerLayoutLoaders(elkLayouts);
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  look: 'classic',
  layout: 'elk',
  themeVariables: {
    fontFamily: "'IBM Plex Sans', 'Avenir Next', sans-serif",
    fontSize: '16px',
    primaryColor: isDark ? '#172117' : '#f2f5ec',
    primaryBorderColor: isDark ? '#a3f329' : '#203500',
    primaryTextColor: isDark ? '#f7f6f0' : '#08090a',
    secondaryColor: isDark ? '#0b2537' : '#eef5fa',
    secondaryBorderColor: isDark ? '#76b9e6' : '#002949',
    secondaryTextColor: isDark ? '#f7f6f0' : '#08090a',
    tertiaryColor: isDark ? '#14271f' : '#eff7f2',
    tertiaryBorderColor: isDark ? '#74c69d' : '#002416',
    tertiaryTextColor: isDark ? '#f7f6f0' : '#08090a',
    lineColor: isDark ? '#94948b' : '#6c6c64',
    clusterBkg: isDark ? '#111411' : '#fbfaf8',
    clusterBorder: isDark ? '#464b46' : '#b9b9b0',
    edgeLabelBackground: isDark ? '#1a1d1a' : '#fffdf9',
  },
});

function initializeDiagram(shell) {
  const wrap = shell.querySelector('.mermaid-wrap');
  const viewport = shell.querySelector('.mermaid-viewport');
  const canvas = shell.querySelector('.mermaid-canvas');
  const source = shell.querySelector('.diagram-source');
  const label = shell.querySelector('.zoom-label');

  if (!wrap || !viewport || !canvas || !source || !label) {
    console.error('FairLend report diagram is missing required elements.', shell);
    return;
  }

  let zoom = 1;
  let fitMode = 'contain';
  let panX = 0;
  let panY = 0;
  let svgWidth = 0;
  let svgHeight = 0;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;
  let touchDistance = 0;
  let touchCenterX = 0;
  let touchCenterY = 0;
  let pointerMoved = false;

  function constrainPan() {
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const renderedWidth = svgWidth * zoom;
    const renderedHeight = svgHeight * zoom;
    const padding = diagramConfig.fitPadding;

    panX = renderedWidth + padding * 2 <= viewportWidth
      ? (viewportWidth - renderedWidth) / 2
      : clamp(panX, viewportWidth - renderedWidth - padding, padding);
    panY = renderedHeight + padding * 2 <= viewportHeight
      ? (viewportHeight - renderedHeight) / 2
      : clamp(panY, viewportHeight - renderedHeight - padding, padding);
  }

  function applyTransform() {
    const svg = canvas.querySelector('svg');
    if (!svg || !svgWidth) return;

    constrainPan();
    svg.style.width = `${svgWidth * zoom}px`;
    svg.style.height = `${svgHeight * zoom}px`;
    canvas.style.transform = `translate(${panX}px, ${panY}px)`;
    label.textContent = `${Math.round(zoom * 100)}% — ${fitMode}`;
  }

  function canPan() {
    const renderedWidth = svgWidth * zoom;
    const renderedHeight = svgHeight * zoom;
    return renderedWidth + diagramConfig.fitPadding * 2 > viewport.clientWidth
      || renderedHeight + diagramConfig.fitPadding * 2 > viewport.clientHeight;
  }

  function computeSmartFit() {
    const availableWidth = Math.max(80, viewport.clientWidth - diagramConfig.fitPadding * 2);
    const availableHeight = Math.max(80, viewport.clientHeight - diagramConfig.fitPadding * 2);
    const contain = Math.min(availableWidth / svgWidth, availableHeight / svgHeight);
    let nextZoom = contain;
    let nextMode = 'contain';

    if (contain < diagramConfig.readabilityFloor) {
      const chartRatio = svgHeight / svgWidth;
      const viewportRatio = viewport.clientHeight / Math.max(viewport.clientWidth, 1);
      if (chartRatio >= viewportRatio) {
        nextZoom = availableWidth / svgWidth;
        nextMode = 'width-priority';
      } else {
        nextZoom = availableHeight / svgHeight;
        nextMode = 'height-priority';
      }
    }

    return {
      zoom: clamp(nextZoom, diagramConfig.minZoom, diagramConfig.maxInitialZoom),
      mode: nextMode,
    };
  }

  function fitDiagram() {
    if (!svgWidth) return;
    const fit = computeSmartFit();
    zoom = fit.zoom;
    fitMode = fit.mode;
    panX = (viewport.clientWidth - svgWidth * zoom) / 2;
    panY = (viewport.clientHeight - svgHeight * zoom) / 2;
    applyTransform();
  }

  function setOneToOne() {
    zoom = clamp(1, diagramConfig.minZoom, diagramConfig.maxZoom);
    fitMode = '1:1';
    panX = (viewport.clientWidth - svgWidth * zoom) / 2;
    panY = (viewport.clientHeight - svgHeight * zoom) / 2;
    applyTransform();
  }

  function zoomAround(factor, centerX, centerY) {
    const nextZoom = clamp(zoom * factor, diagramConfig.minZoom, diagramConfig.maxZoom);
    const ratio = nextZoom / zoom;
    panX = centerX - ratio * (centerX - panX);
    panY = centerY - ratio * (centerY - panY);
    zoom = nextZoom;
    fitMode = 'custom';
    applyTransform();
  }

  function readSvgNaturalSize(svg) {
    let width = 0;
    let height = 0;

    if (svg.viewBox?.baseVal?.width > 0) {
      width = svg.viewBox.baseVal.width;
      height = svg.viewBox.baseVal.height;
    }
    if (!width) {
      width = Number.parseFloat(svg.getAttribute('width')) || 0;
      height = Number.parseFloat(svg.getAttribute('height')) || 0;
    }
    if (!width) {
      const bounds = svg.getBBox();
      width = bounds.width;
      height = bounds.height;
    }
    if (!width) {
      const rectangle = svg.getBoundingClientRect();
      width = rectangle.width || 1000;
      height = rectangle.height || 700;
    }
    if (!svg.getAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    return { width, height };
  }

  function setAdaptiveHeight() {
    if (!svgWidth) return;
    const usableWidth = Math.max(280, wrap.getBoundingClientRect().width - 2);
    const idealHeight = (svgHeight / svgWidth) * usableWidth + diagramConfig.fitPadding * 2;
    const viewportMaximum = Math.floor(innerHeight * diagramConfig.maxHeightVh);
    const hardMaximum = Math.min(
      diagramConfig.maxHeightPx,
      Math.max(diagramConfig.minHeight + 40, viewportMaximum),
    );
    wrap.style.height = `${Math.round(clamp(idealHeight, diagramConfig.minHeight, hardMaximum))}px`;
  }

  function openInNewTab() {
    const svg = canvas.querySelector('svg');
    if (!svg) return;

    const clone = svg.cloneNode(true);
    clone.style.width = '';
    clone.style.height = '';
    const background = isDark ? '#090b0a' : '#f8f7f5';
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FairLend integrated operating model</title><style>
      body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${background};padding:40px;box-sizing:border-box}
      svg{max-width:100%;max-height:90vh;height:auto}</style></head><body>${clone.outerHTML}</body></html>`;
    open(URL.createObjectURL(new Blob([html], { type: 'text/html' })), '_blank');
  }

  async function render() {
    try {
      const code = source.textContent.trim();
      if (!code) throw new Error('Empty diagram source');
      const id = `fairlend-operating-model-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { svg } = await mermaid.render(id, code);
      canvas.innerHTML = svg;

      const svgNode = canvas.querySelector('svg');
      if (!svgNode) throw new Error('No SVG was returned');
      const size = readSvgNaturalSize(svgNode);
      svgWidth = size.width;
      svgHeight = size.height;
      svgNode.removeAttribute('width');
      svgNode.removeAttribute('height');
      svgNode.style.maxWidth = 'none';
      svgNode.style.display = 'block';
      setAdaptiveHeight();
      fitDiagram();
    } catch (error) {
      console.error('Mermaid render failed:', error);
      label.textContent = `Error: ${error.message || 'Render failed'}`;
    }
  }

  const actions = {
    'zoom-in': () => zoomAround(1 + diagramConfig.zoomStep, viewport.clientWidth / 2, viewport.clientHeight / 2),
    'zoom-out': () => zoomAround(1 / (1 + diagramConfig.zoomStep), viewport.clientWidth / 2, viewport.clientHeight / 2),
    'zoom-fit': fitDiagram,
    'zoom-one': setOneToOne,
    'zoom-expand': openInNewTab,
  };

  Object.entries(actions).forEach(([action, handler]) => {
    wrap.querySelector(`[data-action="${action}"]`)?.addEventListener('click', (event) => {
      event.stopPropagation();
      handler();
    });
  });

  viewport.addEventListener('dblclick', (event) => {
    event.stopPropagation();
    fitDiagram();
  });

  viewport.addEventListener('click', () => {
    if (!pointerMoved) openInNewTab();
    pointerMoved = false;
  });

  viewport.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const rectangle = viewport.getBoundingClientRect();
      const factor = event.deltaY < 0
        ? 1 + diagramConfig.zoomStep
        : 1 / (1 + diagramConfig.zoomStep);
      zoomAround(factor, event.clientX - rectangle.left, event.clientY - rectangle.top);
      return;
    }
    if (canPan()) {
      event.preventDefault();
      panX -= event.deltaX;
      panY -= event.deltaY;
      applyTransform();
    }
  }, { passive: false });

  viewport.addEventListener('mousedown', (event) => {
    if (event.target.closest('.zoom-controls') || !canPan()) return;
    wrap.classList.add('is-panning');
    startX = event.clientX;
    startY = event.clientY;
    startPanX = panX;
    startPanY = panY;
    pointerMoved = false;
    event.preventDefault();

    activeDrag = {
      onMove: (moveEvent) => {
        if (Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY) > 5) {
          pointerMoved = true;
        }
        panX = startPanX + (moveEvent.clientX - startX);
        panY = startPanY + (moveEvent.clientY - startY);
        applyTransform();
      },
      onEnd: () => wrap.classList.remove('is-panning'),
    };
  });

  viewport.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      startPanX = panX;
      startPanY = panY;
    } else if (event.touches.length === 2) {
      const deltaX = event.touches[0].clientX - event.touches[1].clientX;
      const deltaY = event.touches[0].clientY - event.touches[1].clientY;
      touchDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const rectangle = viewport.getBoundingClientRect();
      touchCenterX = (event.touches[0].clientX + event.touches[1].clientX) / 2 - rectangle.left;
      touchCenterY = (event.touches[0].clientY + event.touches[1].clientY) / 2 - rectangle.top;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (event) => {
    if (event.touches.length === 1 && canPan()) {
      event.preventDefault();
      panX = startPanX + (event.touches[0].clientX - startX);
      panY = startPanY + (event.touches[0].clientY - startY);
      applyTransform();
    } else if (event.touches.length === 2 && touchDistance > 0) {
      event.preventDefault();
      const deltaX = event.touches[0].clientX - event.touches[1].clientX;
      const deltaY = event.touches[0].clientY - event.touches[1].clientY;
      const nextDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      zoomAround(nextDistance / touchDistance, touchCenterX, touchCenterY);
      touchDistance = nextDistance;
    }
  }, { passive: false });

  new ResizeObserver(() => {
    if (!svgWidth) return;
    setAdaptiveHeight();
    fitDiagram();
  }).observe(wrap);

  render();
}

document.querySelectorAll('.diagram-shell').forEach(initializeDiagram);
