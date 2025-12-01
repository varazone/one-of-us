import catImage from '../../cat-image.ae055f664a2b3739a4a6.png';
import './FloatingCat.css';

export const FloatingCat = () => {
  return (
    <div className="floating-cat">
      <img src={catImage} alt="Cat" />
    </div>
  );
};
