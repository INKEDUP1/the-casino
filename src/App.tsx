import FishGame from './FishGame';
import PurchasePage from './PurchasePage';

export default function App() {
  const path = window.location.pathname;
  if (path === '/purchase') return <PurchasePage />;
  return <FishGame />;
}
