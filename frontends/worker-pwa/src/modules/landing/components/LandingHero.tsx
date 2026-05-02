import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { miscService } from "../../../services/misc.service";
import { earlyAccessSchema } from '../../../validations/zodSchema';
import { useLanguage } from "../../../providers/LanguageContext";

export function LandingHero() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { translations, translate } = useLanguage();

  const originalTexts = {
    heading: "Your Skills Deserve Better Pay. We Make That Happen.",
    subheading: "Connect with verified employers who value your work. Get insurance, weekly pay, and a path to grow your salary."
  };

  useEffect(() => {
    const handleTrigger = () => {
      translate(originalTexts);
    };
    window.addEventListener('trigger-translation', handleTrigger);
    return () => window.removeEventListener('trigger-translation', handleTrigger);
  }, [translate]);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = earlyAccessSchema.safeParse({ email });
    if (!validationResult.success) {
        setError(validationResult.error.issues[0].message);
        return;
    }

    setIsLoading(true);
    setError('');
    try {
      await miscService.requestEarlyAccess({ email, source: 'worker' });
      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative pt-24 md:pt-32 pb-20 px-4 md:px-12 max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[600px] md:min-h-[800px] overflow-x-hidden">
      {/* Extra Hero Blobs for Visual Interest */}
      <div className="absolute top-1/4 -left-20 w-48 h-48 md:w-64 md:h-64 bg-primary-fixed/10 blob-1 -z-10 blur-2xl"></div>
      <div className="absolute top-10 right-1/4 w-32 h-32 md:w-40 md:h-40 bg-secondary-container/30 blob-4 -z-10 opacity-60"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 md:w-96 md:h-96 bg-secondary-container/20 blob-3 -z-10 blur-3xl"></div>
      
      <div className="relative z-10">

        <h1 className="text-[36px] md:text-[68px] font-extrabold text-primary leading-[1.1] text-heavy">
          {translations.heading || originalTexts.heading}
        </h1>
        <p className="mt-6 md:mt-8 text-lg md:text-2xl text-primary/80 max-w-xl leading-relaxed">
          {translations.subheading || originalTexts.subheading}
        </p>
        <div className="mt-10">
          {isSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-700 px-6 py-4 rounded-xl flex items-center gap-3 max-w-lg">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <p className="font-medium">You're on the list! Check your email for confirmation.</p>
            </div>
          ) : (
            <div className="max-w-lg">
              <p className="text-xs font-bold text-primary/40 mb-3 uppercase tracking-widest">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
              <form onSubmit={handleWaitlistSubmit} noValidate className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="email" 
                    placeholder="Enter your email address *" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-[12px] border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary-fixed bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-primary-fixed text-primary px-8 py-4 rounded-[12px] font-extrabold uppercase text-lg flex items-center justify-center gap-2 shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 transition-all disabled:opacity-70 whitespace-nowrap"
                >
                  {isLoading ? <span className="material-symbols-outlined animate-spin">autorenew</span> : 'Request Access'}
                </button>
              </form>
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2 max-w-lg">{error}</p>}
        </div>
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Worker profile photo 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwJTZk1IL5b0p5h3Zkpy_hd21Qeln4SieqC0xc_mDPdt6SOYlR8u7U-4Vgr2GP7ZX-LdqKikzj6Aw2feRruxX5OoGxOjQEqT7Wx9c_jPij0_jZxXU7UcNn5eru_XlwZUVFau7GhkJrr_4H9oNxNCbZfPigIDEmzqDhkVGp0ffTyfwl-fnAc_oYK8Ed7iuaT8IfQ9qRGWdzhguD3o8vDGxazl8Kgy4L5Mbqoh1ZFa4rABdkgt_w1YKU5qvgHz47le0rpjy1uFrFjj4"/>
            <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Worker profile photo 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoHBdrSH26aR5EJLedAQu6zFV9iTeWPx6Nvqu8YE3WRzU_LE5_8k7xVXLVu4TXbNIs7gMZeDqb6rrHxlE7cewvjgtpRb0WUHq8XDgRlYu_opGtMMYmPueCztBhYOSEdE2P2VuReJ-EADJ8lb_Hn8CUygVGm6nwDSe8KjIZ97KiJD6tFdMG2_ZsBaqWeIWG7ZOQffh9iFxibxbjfIsGZQ1ONz1CYOyVh40xws98l8zZr7u_B-yROpM4imavd0i3In_U6AtwNl_oezE"/>
            <img className="w-10 h-10 rounded-full border-2 border-surface object-cover" alt="Worker profile photo 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaXOtjEYvC1Os8NEBt_jLZnjoAy3SkwFdbWLrPtmUc892ROPIK_Mz9E98FzTIXJKWzChhRqCscJr8hqFT9qaiMSMvGHvqjwo_uwE6-aDd_3_uTEiv9N21ljuJrTO343GMjpI8Gyu_ag8omQbJiQzBiEQanX_DrhKZQxwcj6ZMS0OIylqXYF2PLzdB1SmO_1s18HWCfp6R5DRc6zBa3Kj7ZXslXvlJjNIx8egXGs1VRfoqPg836U8qXPQBo6IvhHGabIpoiuqyXIHQ"/>
          </div>
          <span className="text-sm font-bold text-primary/60">Join 12k+ professionals</span>
        </div>
      </div>

      <div className="relative">
        <div className="relative w-full aspect-square max-w-lg mx-auto">
          <div className="absolute inset-0 bg-primary-fixed/10 blob-1 -z-10 blur-3xl"></div>
          <img alt="Confident Indian professional worker" className="w-full h-full object-cover blob-1 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxXORgcKyt9uJ1oFKJ5sJmbKddzEoRKxA-AegAZOCHU5zT58-mjYDmywPjTdrD3nXA7-n4nmfs6uBUDotIHp5koWQaEtXiEZQH5dfUTw_FKs79egOeslzk_DjdzEXhJoymi5-aDYoQUvPVmgyMt2DwVUJhRvP1xNXbxnJnYZZPlq38VDxppqh6_3wPnkkg2_ij-nEXySW0IPojhUqYy-fxTazhj-QDWTq33joAKmalMj3Tt1V0MWeqxHkPRfXBpaoUntYeV4WC4og"/>
          
          {/* Floating Card 1 */}
          <div className="absolute -top-4 -left-4 md:-left-8 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 animate-bounce" style={{ animationDuration: "3s" }}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined font-bold text-sm md:text-base">trending_up</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">New Salary</p>
              <p className="text-lg md:text-xl font-extrabold text-primary">₹22,000</p>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-12 -right-4 md:-right-8 bg-white p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined font-bold text-sm md:text-base">military_tech</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">Skill Level</p>
              <p className="text-lg md:text-xl font-extrabold text-primary">Level Up L3</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
