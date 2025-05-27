import '../styles/Footer.css';
import facebookIcon from '../assets/facebook.svg';
import instagramIcon from '../assets/instagram.svg';
import twitterIcon from '../assets/twitter.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-title">LTH BookShop</div>
          <div className="footer-contact">
            <div>Địa chỉ: <span>Ngõ 6 Ao Sen, Mộ Lao, Hà Đông, Hà Nội</span></div>
            <div>Email: <span>luongthaiha01@gmail.com</span></div>
            <div>Hotline: <span>+84817042482</span></div>
          </div>
        </div>
        <div className="footer-section">
          <div className="footer-social-title">Kết nối với chúng tôi</div>
          <div className="footer-social">
            <a href="/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Facebook">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="/" target="_blank" rel="noopener noreferrer" className="footer-social-icon" title="Twitter">
              <img src={twitterIcon} alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} LTH BookShop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
