export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiYXRlZXEtbm92YSIsImEiOiJjbWQxb2JtYmsxMDlzMmtxdzhuY2h1eHhuIn0.3pdQelFzklbZ_4bahneGhQ';

export const mapboxConfig = {
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-74.006, 40.7128] as [number, number],
  zoom: 18,
  bearing: 0,
  pitch: 0
};