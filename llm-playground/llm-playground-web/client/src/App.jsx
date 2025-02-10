import { useState, useEffect } from "react";
import { postMessages } from "./story-api"; // Your AI call function
import StoryBodyView from "./components/content-view/StoryBodyView";
import PlayerInput from "./components/player-input/PlayerInput";
import { storyConfig } from './story-config';
import backgroundImage from './components/Backround/psychology room.jpg'; // Import your background image

// 21 descriptors per category (no duplicates).
const categoryDescriptors = {
  Greedy: [
    "avaricious", "covetous", "profit-hungry", "money-minded", "material-driven", "self-serving",
    "gold-chasing", "ambitious", "wealth-oriented", "possessive", "capital-craver", "gain-thirsty",
    "acquisitive", "thrifty-obsessive", "greedy-fingered", "hoarding", "market-eyed", "lucre-loving",
    "penny-pincher", "deal-chaser", "fund-focused"
  ],
  Aggressive: [
    "hostile", "combative", "pushy", "forceful", "dominant", "confrontational", "hotheaded", "unyielding",
    "strong-willed", "driven", "fearless", "intimidating", "volatile", "competitive", "brash", "edgy",
    "bold", "challenging", "provocative", "hard-edged", "fiery"
  ],
  Extraversion: [
    "outgoing", "talkative", "energetic", "bubbly", "spirited", "social-butterfly", "vibrant", "expressive",
    "people-loving", "enthusiastic", "gregarious", "lively", "animated", "charming", "boldly-friendly",
    "sunny-disposition", "party-lover", "engaging", "chatty", "vivacious", "extroverted"
  ],
  Agreeableness: [
    "kind", "gentle", "forgiving", "cooperative", "warm-hearted", "empathic", "patient", "helpful",
    "polite", "courteous", "supportive", "charitable", "harmonious", "peace-seeking", "soft-spoken",
    "benevolent", "compassionate", "understanding", "altruistic", "mild-mannered", "giving"
  ],
  Neuroticism: [
    "worried", "anxious", "moody", "restless", "overthinking", "tense", "unstable", "fearful",
    "hyper-alert", "self-conscious", "insecure", "jittery", "stressed", "nervy", "uneasy",
    "frail-nerves", "apprehensive", "delicate-spirits", "fragile", "doubtful", "tremulous"
  ],
};

// 21 jobs per category (placeholders).
const categoryJobs = {
  Greedy: [
    "Stockbroker", "LuxurySalesperson", "InvestmentBanker", "ArtDealer", "VentureCapitalist", "WealthAdvisor",
    "CryptoTrader", "High-EndBrandManager", "BigTechExecutive", "RealEstateTycoon", "Import/ExportMagnate", "PrivateEquityPartner",
    "GoldMerchant", "FinanceConsultant", "CommercialLoanOfficer", "LuxuryResortManager", "MergerSpecialist", "QuantTrader",
    "WealthManager", "CommoditiesBroker", "StartUpCFO"
  ],
  Aggressive: [
    "CorporateNegotiator", "DrillSergeant", "CrisisManager", "TrialAttorney", "SportsCoach", "PoliticalLobbyist",
    "SWATOfficer", "SpecialOpsRecruiter", "CompetitionAnalyst", "MMAFighter", "Hacker(OffensiveSecurity)", "DebateChampion",
    "BountyHunter", "HeadOfSecurity", "HostileTakeoverConsultant", "BoxingCoach", "ConfrontationStrategist", "PoliticalCampaignDirector",
    "AggressiveSalesCloser", "Enforcer", "AntiTerrorSpecialist"
  ],
  Extraversion: [
    "EventHost", "Entertainer", "PartyPlanner", "TalentAgent", "TalkShowHost", "TourGuide",
    "RadioPresenter", "Recruiter", "MasterOfCeremonies", "PublicRelationsRep", "Spokesperson", "SocialMediaInfluencer",
    "FestivalCoordinator", "WeddingMC", "ComedyClubHost", "TravelBlogger", "NewsReporter", "ResortAnimator",
    "PartyPromoter", "NightclubHost", "ConferenceSpeaker"
  ],
  Agreeableness: [
    "CommunityOutreachManager", "Therapist", "Mediator", "Diplomat", "SocialWorker", "NGOCoordinator",
    "CharityOrganizer", "FriendlyTeacher", "HumanitarianAid", "CustomerServiceLead", "VolunteerCoordinator", "HospiceCareManager",
    "EmpathyTrainer", "ConflictResolutionOfficer", "NonProfitDirector", "SupportGroupFacilitator", "Counselor", "PeaceAdvocate",
    "TeamHarmonyCoach", "FamilyServicesConsultant", "ShelterManager"
  ],
  Neuroticism: [
    "RiskManager", "QualityAssuranceTester", "EmergencyDispatcher", "DisasterPlanner", "SecurityAnalyst", "ComplianceOfficer",
    "HazMatResponder", "InsuranceUnderwriter", "CrisisHotlineOperator", "AirTrafficController", "MedicalLabTech", "SurvivalInstructor",
    "FireSafetyInspector", "OCDCoach", "PrecisionMechanic", "AuditInvestigator", "OverseasAidLogistics", "CybersecurityController",
    "SafetyOfficer", "EmergencyRoomManager", "FoodSafetyInspector"
  ],
};

function App() {
  const [turnCount, setTurnCount] = useState(0);
  const [maxTurns] = useState(Math.floor(Math.random() * 8) + 8);
  const [messages, setMessages] = useState([
    { role: 'system', content: storyConfig.instructions },
    { role: 'assistant', content: storyConfig.openingLine },
    { role: 'assistant', content: storyConfig.firstCallToAction }
  ]);
  const [categories, setCategories] = useState({
    Greedy: 0,
    Aggressive: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  });
  const [apiStatus, setStatus] = useState('idle');
  const [response, setResponse] = useState(null);
  const [awaitingJobDecision, setAwaitingJobDecision] = useState(false);
  const [storyShouldEnd, setStoryShouldEnd] = useState(false);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    if (turnCount >= maxTurns && !awaitingJobDecision && !storyShouldEnd) {
      finalizeConversation();
    }
  }, [turnCount, maxTurns, awaitingJobDecision, storyShouldEnd]);

  function addMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  function handleInactivity() {
    if (!response) return;
    if (response.playerEngagement <= 0.6) {
      addMessage({ role: 'assistant', content: response.storyEvent });
    } else {
      addMessage({ role: 'assistant', content: response.callToAction });
    }
  }

  function handleSend(playerText) {
    if (awaitingJobDecision) {
      const decision = playerText.toLowerCase();
      if (decision.includes("yes") || decision.includes("sure") || decision.includes("accept")) {
        addMessage({ 
          role: 'assistant', 
          content: "I'm pleased to hear that, John. Let me finalize your offer letter..." 
        });
        generateOfferLetter();
      } else {
        addMessage({ 
          role: 'assistant', 
          content: "I understand your hesitation, John. We'll end here for now. Take care and remember you're not alone in this journey." 
        });
        setStatus('ended');
      }
      setAwaitingJobDecision(false);
      return;
    }

    const newMessages = [...messages, { role: 'user', content: playerText }];
    setMessages(newMessages);
    setTurnCount(prev => prev + 1);
    setStatus('loading');

    postMessages(newMessages, handleResponse);
  }

  function handleResponse({ messages: newMsgs, response: res, error }) {
    if (error || !res) {
      setStatus('error');
      return;
    }

    addMessage({ role: 'assistant', content: res.storyText });
    setStatus('idle');
    setResponse(res);

    const chosenCategory = res.chosenCategory;
    if (chosenCategory && categories.hasOwnProperty(chosenCategory)) {
      setCategories(prev => {
        const updated = { ...prev, [chosenCategory]: prev[chosenCategory] + 1 };
        return updated;
      });
      setCategoryCount(prev => prev + 1);
    } else {
      console.warn('[WARN] No valid "chosenCategory" found in response!');
    }

    if (storyShouldEnd) {
      finalizeConversation();
    }
  }

  function finalizeConversation() {
    setStoryShouldEnd(true);

    const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const [cat1, cat2, cat3] = sortedCats.slice(0, 3).map(item => item[0]);

    const desc1 = pickRandom(categoryDescriptors[cat1]);
    const desc2 = pickRandom(categoryDescriptors[cat2]);
    const job = pickRandom(categoryJobs[cat3]);

    const combinedRole = `${desc1}, ${desc2} ${job}`;

    let finalMsg = `
John, I've been listening closely to how you've carried your father's legacy and the burdens that came with it.
After reflecting on your stories—both the regrets and the hopes—I propose a role as a **${combinedRole}**.
Tell me, would you consider this direction? And if you could go back, is there anything you'd change about how you handled the store?
    `.trim();

    addMessage({ role: 'assistant', content: finalMsg });
    setAwaitingJobDecision(true);
  }

  function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateOfferLetter() {
    const lastAssistantMsg = messages[messages.length - 1].content;
    const roleMatch = lastAssistantMsg.match(/as a \*\*(.+?)\*\*/);
    const combinedRole = roleMatch ? roleMatch[1] : "Mysterious Role";

    const letter = `
--------------------------------------\n
RECCOMANDATION LETTER - Dr. Morgan's Guidance\n
--------------------------------------\n
John,\n

Throughout our conversations, we've uncovered pieces of your father's story and how deeply it affected you.\n
I'm delighted to reccomend you this unique position.\n

Highlights:\n
- A chance to transform the lessons from your father's store into new opportunities.\n
- An environment encouraging you to grow emotionally, turning regrets into strengths.\n

Thank you for sharing your journey with me. If you choose to accept, we can start immediately.\n
--------------------------------------
    `.trim();

    addMessage({ role: 'assistant', content: letter });
    setStatus('ended');
  }

  // Define background style with imported image and fixed background
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',  // Keeps the background fixed during scrolling
    height: '100vh', // Full viewport height
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    position: 'relative',
    padding: '20px',
    overflowY: 'auto', // Allow vertical scrolling of content
  };

  return (
    <div style={backgroundStyle}>
      <h1 style={{ textAlign: 'center', color: 'white' }}>{storyConfig.name || 'Open Story'}</h1>
      <StoryBodyView apiStatus={apiStatus} messages={messages} />
      <PlayerInput
        apiStatus={apiStatus}
        onSend={handleSend}
        onInactivity={handleInactivity}
      />
      {apiStatus === 'ended' && (
        <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
          (Session ended. Take some time to reflect on what we've uncovered about John's journey.)
        </p>
      )}
    </div>
  );
}

export default App;
