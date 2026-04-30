import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '../../api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    notificationEmail: '',
    facebookUrl: '',
    instagramUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      setSettings(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.update(settings);
      toast.success('Paramètres sauvegardés avec succès');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white font-bold">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configurez les informations de votre boutique
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <div className="card p-6">
          <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
            🏪 Informations de la boutique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Nom de la boutique *
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                required
                placeholder="MYZshop"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                required
                placeholder="+216 XX XXX XXX"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                required
                placeholder="contact@myzshop.tn"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Adresse *
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                required
                placeholder="Tunis, Tunisie"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="card p-6">
          <h2 className="font-display text-xl text-white mb-6 flex items-center gap-2">
            📱 Contact & Réseaux sociaux
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Numéro WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="+216 XX XXX XXX"
                className="input-field"
              />
              <p className="text-gray-600 text-xs mt-1">
                Utilisé pour le bouton "Commander par WhatsApp"
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                Email de notification
              </label>
              <input
                type="email"
                name="notificationEmail"
                value={settings.notificationEmail}
                onChange={handleChange}
                placeholder="orders@myzshop.tn"
                className="input-field"
              />
              <p className="text-gray-600 text-xs mt-1">
                Recevez les notifications de nouvelles commandes ici
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                URL Facebook
              </label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="input-field"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                URL Instagram
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Email Configuration Info */}
        <div className="card p-6 bg-brand-500/5 border-brand-500/20">
          <h2 className="font-display text-xl text-white mb-4 flex items-center gap-2">
            📧 Configuration Email
          </h2>
          <div className="text-gray-400 text-sm space-y-2">
            <p>
              Les emails de notification sont envoyés via Gmail (Nodemailer).
            </p>
            <p>
              Assurez-vous que les variables d'environnement suivantes sont configurées sur le serveur:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-brand-400 font-mono text-xs">
              <li>EMAIL_USER - Votre adresse Gmail</li>
              <li>EMAIL_PASS - Votre mot de passe d'application Gmail</li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              💡 Pour Gmail, utilisez un "Mot de passe d'application" depuis les paramètres de sécurité de votre compte Google.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={loadSettings}
            disabled={saving}
            className="btn-ghost"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sauvegarde...
              </>
            ) : (
              '💾 Sauvegarder'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
