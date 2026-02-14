import { TokenGenerator } from '@/components/TokenGenerator';
import { Navigation } from '@/components/Navigation';

const TokenPage = () => {
  return (
    <div className="pt-0 lg:pt-16 pb-16 lg:pb-0">
      <Navigation />
      <TokenGenerator />
    </div>
  );
};

export default TokenPage;
