import { HomePage } from '@/components/HomePage';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  return (
    <div className="pt-0 lg:pt-16 pb-16 lg:pb-0">
      <Navigation />
      <HomePage />
    </div>
  );
};

export default Index;
