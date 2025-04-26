import { ReactNode } from 'react';
import healthLogo from '../public/health.png';

type ClinicHeaderProps = {
  size?: 'small' | 'medium';
  position?: 'left' | 'center';
  children?: ReactNode;
};

export default function ClinicHeader({ 
  size = 'small', 
  position = 'left',
  children 
}: ClinicHeaderProps) {
  return (
    <header className={`flex ${position === 'center' ? 'justify-center' : 'justify-start'} items-center mb-6`}>
      <div className={`flex items-center ${size === 'medium' ? 'gap-4' : 'gap-2'}`}>
        <img 
          src={healthLogo} 
          alt="Renata Ragazzo Logo" 
          className={size === 'medium' ? 'h-12 w-12' : 'h-8 w-8'}
        />
        <h1 className={size === 'medium' ? 'text-2xl font-bold text-blue-600' : 'text-xl font-semibold text-orange-600'}>
          Renata Ragazzo
        </h1>
        {children}
      </div>
    </header>
  );
}