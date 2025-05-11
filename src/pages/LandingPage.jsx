"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

// Import des images avec des chemins relatifs corrects
import sciencesImg from '../images/sciences.jpg'
import litteratureImg from '../images/litterature.jpg'
import informatiqueImg from '../images/informatique.jpg'
import histoireImg from '../images/histoire.jpg'
import economieImg from '../images/economie.jpg'
import languesImg from '../images/langues.jpg'
import avatar1 from '../images/avatar1.jpg'
import avatar2 from '../images/avatar2.jpg'
import avatar3 from '../images/avatar3.jpg'

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`landing-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="logo">
            <h1>Bibliothèque ISET</h1>
          </div>
          <nav className="landing-nav">
            <ul>
              <li><a href="#features">Fonctionnalités</a></li>
              <li><a href="#collection">Collection</a></li>
              <li><a href="#testimonials">Témoignages</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/login" className="login-btn">Connexion</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenue à la Bibliothèque ISET</h1>
            <p>Découvrez notre vaste collection de livres et ressources académiques</p>
            <div className="hero-buttons">
              <Link to="/login" className="primary-btn">Se connecter</Link>
              <a href="#features" className="secondary-btn">En savoir plus</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Nos Services</h2>
            <p>Découvrez tout ce que notre bibliothèque peut vous offrir</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-book"></i></div>
              <h3>Vaste Collection</h3>
              <p>Plus de 10,000 livres couvrant tous les domaines académiques et littéraires.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-laptop"></i></div>
              <h3>Ressources Numériques</h3>
              <p>Accès à des milliers d'e-books, journaux scientifiques et bases de données.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-calendar-alt"></i></div>
              <h3>Réservation Facile</h3>
              <p>Réservez vos livres en ligne et recevez des notifications pour les retours.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-users"></i></div>
              <h3>Espaces d'Étude</h3>
              <p>Salles de travail individuelles et en groupe disponibles sur réservation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="collection-section">
        <div className="container">
          <div className="section-header">
            <h2>Notre Collection</h2>
            <p>Explorez nos catégories de livres et ressources</p>
          </div>
          <div className="collection-grid">
            <div className="collection-card">
              <img src={sciencesImg} alt="Sciences" />
              <div className="collection-overlay">
                <h3>Sciences</h3>
                <p>Physique, Chimie, Biologie</p>
              </div>
            </div>
            <div className="collection-card">
              <img src={litteratureImg} alt="Littérature" />
              <div className="collection-overlay">
                <h3>Littérature</h3>
                <p>Romans, Poésie, Essais</p>
              </div>
            </div>
            <div className="collection-card">
              <img src={informatiqueImg} alt="Informatique" />
              <div className="collection-overlay">
                <h3>Informatique</h3>
                <p>Programmation, Réseaux, IA</p>
              </div>
            </div>
            <div className="collection-card">
              <img src={histoireImg} alt="Histoire" />
              <div className="collection-overlay">
                <h3>Histoire</h3>
                <p>Mondiale, Régionale, Art</p>
              </div>
            </div>
            <div className="collection-card">
              <img src={economieImg} alt="Économie" />
              <div className="collection-overlay">
                <h3>Économie</h3>
                <p>Finance, Management, Marketing</p>
              </div>
            </div>
            <div className="collection-card">
              <img src={languesImg} alt="Langues" />
              <div className="collection-overlay">
                <h3>Langues</h3>
                <p>Anglais, Français, Espagnol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Livres</p>
            </div>
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Étudiants Actifs</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>E-books</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Postes de Travail</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Témoignages</h2>
            <p>Ce que nos utilisateurs disent de nous</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"La bibliothèque ISET a été une ressource inestimable pour mes études. Le système de réservation en ligne est très pratique."</p>
              </div>
              <div className="testimonial-author">
                <img src={avatar1} alt="Sarah L." />
                <div>
                  <h4>Sarah L.</h4>
                  <p>Étudiante en Informatique</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"J'apprécie particulièrement les espaces de travail calmes et bien équipés. Parfait pour se concentrer sur mes projets de recherche."</p>
              </div>
              <div className="testimonial-author">
                <img src={avatar2} alt="Mohamed A." />
                <div>
                  <h4>Mohamed A.</h4>
                  <p>Doctorant en informatique</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Le personnel est toujours disponible et compétent. Ils m'ont aidé à trouver des ressources spécifiques pour mon mémoire."</p>
              </div>
              <div className="testimonial-author">
                <img src={avatar3} alt="Amina B." />
                <div>
                  <h4>Amina B.</h4>
                  <p>Étudiante en Électrique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contactez-nous</h2>
              <p>Nous sommes là pour répondre à toutes vos questions</p>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>123 Avenue de la République, Tunis, Tunisie</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <p>+216 71 123 456</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <p>contact@bibliotheque-iset.tn</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-clock"></i>
                  <p>Lun-Ven: 8h-18h | Sam: 9h-13h</p>
                </div>
              </div>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Nom complet</label>
                  <input type="text" id="name" placeholder="Votre nom" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Votre email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input type="text" id="subject" placeholder="Sujet de votre message" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" rows="5" placeholder="Votre message" required></textarea>
                </div>
                <button type="submit" className="submit-btn">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <h3>Bibliothèque ISET</h3>
              <p>Notre mission est de fournir un accès facile et équitable aux ressources éducatives pour tous les étudiants et chercheurs.</p>
            </div>
            <div className="footer-links">
              <h3>Liens Rapides</h3>
              <ul>
                <li><a href="#features">Fonctionnalités</a></li>
                <li><a href="#collection">Collection</a></li>
                <li><a href="#testimonials">Témoignages</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><Link to="/login">Connexion</Link></li>
              </ul>
            </div>
            <div className="footer-hours">
              <h3>Heures d'Ouverture</h3>
              <ul>
                <li><span>Lundi - Vendredi:</span> 8h - 18h</li>
                <li><span>Samedi:</span> 9h - 13h</li>
                <li><span>Dimanche:</span> Fermé</li>
              </ul>
            </div>
            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Abonnez-vous pour recevoir nos actualités</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Votre email" required />
                <button type="submit"><i className="fas fa-paper-plane"></i></button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Bibliothèque ISET. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage