// Central icon registry - maps identifiers to actual XP icon images
// Import all icons statically for Vite bundling

// Desktop / App icons (32x32)
import myComputer32 from '../assets/windowsIcons/676(32x32).png';
import myDocuments32 from '../assets/windowsIcons/288(32x32).png';
import ie32 from '../assets/windowsIcons/ie.png';
import notepad32 from '../assets/windowsIcons/327(32x32).png';
import paint32 from '../assets/windowsIcons/680(32x32).png';
import calculator32 from '../assets/windowsIcons/74(32x32).png';
import cmd32 from '../assets/windowsIcons/743(32x32).png';
import controlPanel32 from '../assets/windowsIcons/358(32x32).png';
import winamp32 from '../assets/windowsIcons/winamp.png';
import mediaPlayer32 from '../assets/windowsIcons/846(32x32).png';
import minesweeper32 from '../assets/windowsIcons/367(32x32).png';
import recycleBinEmpty from '../assets/windowsIcons/29.png';
import recycleBinFull from '../assets/windowsIcons/290.png';

// Folder / File icons
import folder32 from '../assets/windowsIcons/337(32x32).png';
import folderOpen32 from '../assets/windowsIcons/57(32x32).png';
import folder16 from '../assets/windowsIcons/folder.png';
import hardDrive32 from '../assets/windowsIcons/334(48x48).png';
import myPictures32 from '../assets/windowsIcons/289(32x32).png';

// Navigation / Toolbar
import backIcon from '../assets/windowsIcons/back.png';
import forwardIcon from '../assets/windowsIcons/forward.png';
import upIcon from '../assets/windowsIcons/up.png';
import homeIcon from '../assets/windowsIcons/home.png';
import refreshIcon from '../assets/windowsIcons/refresh.png';
import stopIcon from '../assets/windowsIcons/stop.png';
import searchIcon from '../assets/windowsIcons/299(32x32).png';
import favoritesIcon from '../assets/windowsIcons/744(32x32).png';
import historyIcon from '../assets/windowsIcons/history.png';

// System / OS
import windowsLogo from '../assets/windowsIcons/windows-off.png';
import windowsSmall from '../assets/windowsIcons/windows.png';
import startBtn from '../assets/windowsIcons/start.png';
import userAvatar from '../assets/windowsIcons/user.png';
import shutdownIcon from '../assets/windowsIcons/310(32x32).png';
import logoffIcon from '../assets/windowsIcons/546(32x32).png';
import helpIcon from '../assets/windowsIcons/747(32x32).png';
import networkIcon from '../assets/windowsIcons/309(32x32).png';
import outlookExpress from '../assets/windowsIcons/887(32x32).png';
import msnIcon from '../assets/windowsIcons/msn.png';
import errorIcon from '../assets/windowsIcons/897(32x32).png';

// Small 16x16 icons
import myComputer16 from '../assets/windowsIcons/676(16x16).png';
import notepad16 from '../assets/windowsIcons/327(16x16).png';
import ie16 from '../assets/windowsIcons/119(16x16).png';
import folder16alt from '../assets/windowsIcons/318(16x16).png';
import controlPanel16 from '../assets/windowsIcons/358(16x16).png';
import cmd16 from '../assets/windowsIcons/56(16x16).png';
import paint16 from '../assets/windowsIcons/680(16x16).png';
import calculator16 from '../assets/windowsIcons/74(16x16).png';
import help16 from '../assets/windowsIcons/747(16x16).png';
import file16 from '../assets/windowsIcons/58(16x16).png';

// Wallpaper
import wallpaper from '../assets/wallpaper.png';

export const ICONS = {
  // Apps - 32x32
  myComputer: myComputer32,
  myDocuments: myDocuments32,
  ie: ie32,
  notepad: notepad32,
  paint: paint32,
  calculator: calculator32,
  cmd: cmd32,
  controlPanel: controlPanel32,
  winamp: winamp32,
  mediaPlayer: mediaPlayer32,
  minesweeper: minesweeper32,
  recycleBinEmpty,
  recycleBinFull,

  // Folders
  folder: folder32,
  folderOpen: folderOpen32,
  folderSmall: folder16,
  hardDrive: hardDrive32,
  myPictures: myPictures32,

  // Navigation
  back: backIcon,
  forward: forwardIcon,
  up: upIcon,
  home: homeIcon,
  refresh: refreshIcon,
  stop: stopIcon,
  search: searchIcon,
  favorites: favoritesIcon,
  history: historyIcon,

  // System
  windowsLogo,
  windowsSmall,
  startBtn,
  userAvatar,
  shutdown: shutdownIcon,
  logoff: logoffIcon,
  help: helpIcon,
  network: networkIcon,
  outlookExpress,
  msn: msnIcon,
  error: errorIcon,

  // Small 16x16
  myComputer16,
  notepad16,
  ie16,
  folder16: folder16alt,
  controlPanel16,
  cmd16,
  paint16,
  calculator16,
  help16,
  file16,
};

// Wallpaper export
export const WALLPAPER = wallpaper;

// Helper to get icon for file system items
export function getFileIcon(item) {
  if (item.iconPath) return item.iconPath;
  if (item.type === 'folder') return ICONS.folder;
  return ICONS.file16;
}

export default ICONS;
