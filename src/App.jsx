import React, { useState, useRef, useEffect } from "react";
import {
  Home, Compass, Users, MessageCircle, Bell, User, Settings,
  Heart, MessageSquare, Share2, Image as ImageIcon, Send, Moon, Sun,
  EyeOff, Trash2, Flag, Link2, Search, X, Plus, ChevronLeft, ChevronRight, Sparkles,
  TrendingUp, UserPlus, Check, Flame, ThumbsUp, Laugh, Star, MoreHorizontal,
  Bookmark, Pencil, Copy, EyeOff as HideIcon, Smile, MapPin, Globe, Lock,
  Video, PanelLeftClose, PanelLeftOpen, Loader2, Clock, Ban, Grid3x3, Info, Shuffle,
  Film, Volume2, VolumeX, ChevronUp, ChevronDown, Upload as UploadIcon,
  UserMinus, Crown, Radio, Camera, LogOut,
  Coins, Gift, PlayCircle, Sparkle,
  Mic, MicOff, VideoOff, PhoneOff, PhoneCall,
  Eye, Mail
} from "lucide-react";

/* ---------------------------------------------------------
   LINKLY — prototype
   Design tokens
   Color: ink #14131F / paper #FAFAF7 / signal #3F3DF2 (indigo)
          ping #FF5D6C (coral accent, anonymous feature only)
          line #E7E5DE (hairline borders, light mode)
   Type: "Space Grotesk" for display, "Inter" for body/UI
   Layout: asymmetric — left icon rail, center content column
            capped at 640px, right context panel. Accent bar
            (not drop-shadow) marks active/selected state.
--------------------------------------------------------- */

const FONT_LINK_ID = "linkly-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const seedPosts = [];

const seedAnon = [];

const seedThreads = [];

const seedStories = [];

const seedSuggested = [];

const seedTrending = [];

const seedNotifications = [];

const REACTIONS = [
  { id: "like", emoji: "👍", label: "Like", color: "#3F3DF2" },
  { id: "love", emoji: "❤️", label: "Love", color: "#FF5D6C" },
  { id: "care", emoji: "🥰", label: "Care", color: "#FFB13F" },
  { id: "haha", emoji: "😂", label: "Haha", color: "#FFB13F" },
  { id: "wow", emoji: "😮", label: "Wow", color: "#FFB13F" },
  { id: "sad", emoji: "😢", label: "Sad", color: "#8C8A78" },
  { id: "angry", emoji: "😡", label: "Angry", color: "#FF5D6C" },
  { id: "disgusted", emoji: "🤢", label: "Disgusted", color: "#2ECC71" },
];

const PRIVACY_OPTIONS = [
  { id: "public", label: "Public", Icon: Globe },
  { id: "friends", label: "Friends", Icon: Users },
  { id: "private", label: "Only me", Icon: Lock },
];

const FEELINGS = ["🙂 happy", "😌 relieved", "🥲 nostalgic", "😤 motivated", "😴 tired", "🎉 celebrating"];

const seedOnline = [];

const STRANGER_NAMES = ["Kai Fernandez", "Bea Santos", "Marc Villareal", "Noa dela Cruz", "Iris Tan", "Leo Ramos"];

const STRANGER_REPLIES = [
  "haha same honestly",
  "wait that's actually a really good point",
  "okay I did not expect this conversation to go here",
  "lol fair enough",
  "what made you think of that?",
  "I feel like more people should talk about this",
  "honestly kind of relate to that",
  "hm, never thought about it that way",
  "that's oddly specific, I like it",
  "so what do you do when you're not doing this",
];

const REVEAL_THRESHOLDS = [4, 8, 13, 19]; // messages needed to auto-unlock stage 1, 2, 3, 4
const REVEAL_STAGE_LABELS = ["Anonymous", "Initials", "First name", "First name + initial", "Full identity"];

const LIVE_VIEWER_NAMES = ["Teo V.", "Rhea D.", "Sam U.", "Jonas P.", "Mika R.", "Priya N.", "Alden C.", "guest_2291"];

// Fictional placeholder sponsors — demo content only, not real advertisers or links.
const SPONSORS = [
  { id: "sp1", brand: "Brew & Co", tagline: "Cold brew, delivered before 8am.", cta: "Order now", gradient: "linear-gradient(135deg,#4A2E1E,#8C5A3B)" },
  { id: "sp2", brand: "Trailhead Gear", tagline: "Gear up for your next weekend hike.", cta: "Shop gear", gradient: "linear-gradient(135deg,#2E5B3F,#7DBE8A)" },
  { id: "sp3", brand: "NimbusCloud", tagline: "Storage that just works, for teams of any size.", cta: "Try free", gradient: "linear-gradient(135deg,#1E3A5F,#4E8FD1)" },
  { id: "sp4", brand: "Loop Fitness", tagline: "5 classes a week, first month on us.", cta: "Join now", gradient: "linear-gradient(135deg,#5B1E3A,#D14E8F)" },
];

const AD_REWARD = 25;

const CALL_PERIOD_COST = 10;
const CALL_PERIOD_MINUTES = 20;
const CALL_PERIOD_MS = 20000; // demo tick — stands in for the real 20-minute billing period

const REDEEM_CATALOG = [
  { id: "adfree", label: "24h ad-free", cost: 100, Icon: EyeOff, desc: "No sponsored posts or rewarded-ad prompts for a day" },
  { id: "frame", label: "Avatar frame", cost: 120, Icon: Sparkle, desc: "A colored ring around your profile photo" },
  { id: "boost", label: "Boost a post", cost: 200, Icon: TrendingUp, desc: "Pin one of your posts to the top of Explore for a day" },
  { id: "supporter", label: "Supporter badge", cost: 300, Icon: Crown, desc: "A permanent badge next to your name" },
];
const LIVE_COMMENTS = ["heyyy 👋", "let's gooo", "wait what did I miss", "this is fun", "hi from here!", "🔥🔥🔥", "can you say hi to me", "no way", "loving this stream", "🎉"];

const seedReels = [];

function LinklyMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
      <rect x="20" y="20" width="120" height="120" rx="30" fill="#3F3DF2" />
      <rect x="103" y="103" width="86" height="86" rx="22" fill="#FF5D6C" transform="rotate(-14 146 146)" />
      <circle cx="122" cy="122" r="9" fill="#FAFAF7" />
    </svg>
  );
}

function Avatar({ name, size = 40, tone = "signal", src }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  const bg = tone === "signal" ? "#3F3DF2" : "#FF5D6C";
  if (src) {
    return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />;
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: bg,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function MyAvatar({ name, avatarUrl, size = 40 }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ width: size, height: size, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />;
  }
  return <Avatar name={name} size={size} />;
}

function GlobalStyle() {
  return (
    <style>{`
      @keyframes linkly-pop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 100% { transform: scale(1); } }
      @keyframes linkly-ring { 0% { box-shadow: 0 0 0 0 rgba(63,61,242,0.35); } 100% { box-shadow: 0 0 0 8px rgba(63,61,242,0); } }
      @keyframes linkly-slidein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes linkly-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes linkly-progress { from { width: 0%; } to { width: 100%; } }
      .linkly-pop { animation: linkly-pop 0.32s ease; }
      .linkly-slidein { animation: linkly-slidein 0.25s ease; }
      .linkly-story-ring:hover { animation: linkly-ring 1s ease infinite; }
      @keyframes linkly-reel-drift { 0% { transform: scale(1.08) rotate(0deg); filter: hue-rotate(0deg); } 50% { transform: scale(1.16) rotate(1.5deg); filter: hue-rotate(8deg); } 100% { transform: scale(1.08) rotate(0deg); filter: hue-rotate(0deg); } }
      .linkly-reel-bg { animation: linkly-reel-drift 9s ease-in-out infinite; }
      @keyframes linkly-float-up { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translateY(-320px) scale(1.1); opacity: 0; } }
      .linkly-float-heart { position: absolute; bottom: 0; font-size: 18px; animation: linkly-float-up 6s ease-in infinite; }
      @keyframes linkly-live-pulse { 0% { box-shadow: 0 0 0 0 rgba(255,93,108,0.5); } 100% { box-shadow: 0 0 0 10px rgba(255,93,108,0); } }
      .linkly-live-dot { animation: linkly-live-pulse 1.4s ease-out infinite; }
      .linkly-spin { animation: linkly-spin 0.7s linear infinite; }
      button { transition: transform 0.12s ease, background 0.15s ease, opacity 0.15s ease; }
      button:active { transform: scale(0.95); }
      input, textarea { transition: border-color 0.15s ease; }
    `}</style>
  );
}

function StoriesBar({ stories, onOpen, dark, onAddStory }) {
  const fileRef = useRef(null);
  const pick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAddStory(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div style={{ display: "flex", gap: 14, padding: "4px 2px 18px", overflowX: "auto" }}>
      <button
        onClick={() => fileRef.current?.click()}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 60 }}
      >
        <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px dashed ${dark ? "#3A3947" : "#D8D6CC"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Plus size={20} color={dark ? "#7A7869" : "#8C8A78"} />
        </div>
        <span style={{ fontSize: 11, color: dark ? "#B8B6AD" : "#4A4938" }}>Add story</span>
        <input ref={fileRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
      </button>
      {stories.map((s) => (
        <button
          key={s.id}
          onClick={() => onOpen(s.id)}
          className="linkly-story-ring"
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, width: 60 }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              padding: 2.5,
              background: s.viewed ? (dark ? "#2C2B39" : "#E7E5DE") : s.gradient,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${dark ? "#14131F" : "#FAFAF7"}`, overflow: "hidden" }}>
              <Avatar name={s.name} size={48} tone={s.viewed ? "signal" : "ping"} />
            </div>
          </div>
          <span style={{ fontSize: 11, color: dark ? "#B8B6AD" : "#4A4938", maxWidth: 58, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {s.name.split(" ")[0]}
          </span>
        </button>
      ))}
    </div>
  );
}

function StoryViewer({ stories, index, onClose, onNext, onPrev, onDelete }) {
  const story = stories[index];
  useEffect(() => {
    if (!story) return;
    const t = setTimeout(onNext, 4500);
    return () => clearTimeout(t);
  }, [index, story]);

  if (!story) return null;

  const bg = story.image ? `url(${story.image}) center/cover` : story.gradient;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,10,16,0.86)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} style={{ position: "absolute", left: "calc(50% - 200px)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: index > 0 ? "flex" : "none", alignItems: "center", justifyContent: "center" }}>
        <ChevronLeft size={18} color="white" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="linkly-slidein"
        style={{ width: 300, height: 480, borderRadius: 16, background: bg, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 16, overflow: "hidden" }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {stories.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
              {i === index && <div style={{ height: "100%", background: "white", animation: "linkly-progress 4.5s linear forwards" }} />}
              {i < index && <div style={{ height: "100%", background: "white" }} />}
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.25)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={15} color="white" />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "absolute", top: 26, left: 16 }}>
          <Avatar name={story.name} size={28} />
          <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{story.name}</span>
        </div>
        <div style={{ color: "white", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 22, textAlign: "center", padding: "0 8px", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
          {story.caption}
        </div>
        {story.own && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(story.id); }} style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.35)", border: "none", borderRadius: 8, padding: "6px 12px", color: "white", fontSize: 12, cursor: "pointer" }}>
            <Trash2 size={12} /> Delete story
          </button>
        )}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} style={{ position: "absolute", right: "calc(50% - 200px)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: index < stories.length - 1 ? "flex" : "none", alignItems: "center", justifyContent: "center" }}>
        <ChevronRight size={18} color="white" />
      </button>
    </div>
  );
}

function AdSlot({ dark, slot = "YOUR_AD_SLOT_ID" }) {
  const ref = useRef(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    try {
      if (window.adsbygoogle && ref.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setFilled(true);
      }
    } catch {
      // AdSense script not loaded here (e.g. this in-chat preview) — falls back to the label below.
    }
  }, []);

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
        Advertisement
      </div>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", minHeight: filled ? undefined : 90, background: dark ? "#1B1A28" : "#F2F0E8", borderRadius: 10 }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {!filled && (
        <div style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78", textAlign: "center", marginTop: -70, position: "relative" }}>
          Ad slot — connects once deployed with a real AdSense ID
        </div>
      )}
    </div>
  );
}

function RightPanel({ dark, suggested, setSuggested, trending, onOpenChat, toast }) {
  const [loadingId, setLoadingId] = useState(null);

  const toggleFollow = (id) => {
    setLoadingId(id);
    setTimeout(() => {
      setSuggested((us) => us.map((u) => (u.id === id ? { ...u, following: !u.following } : u)));
      setLoadingId(null);
      const u = suggested.find((x) => x.id === id);
      toast(u && !u.following ? `Now following ${u.name}` : `Unfollowed`);
    }, 500);
  };
  const remove = (id) => setSuggested((us) => us.filter((u) => u.id !== id));

  return (
    <div style={{ width: 260, flexShrink: 0, padding: "24px 18px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Suggested for you</div>
        {suggested.length === 0 && <div style={{ fontSize: 12, color: dark ? "#7A7869" : "#8C8A78" }}>No more suggestions right now.</div>}
        {suggested.map((u) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar name={u.name} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
              <div style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78" }}>{u.note}</div>
            </div>
            <button
              onClick={() => toggleFollow(u.id)}
              disabled={loadingId === u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11.5,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 7,
                cursor: "pointer",
                border: u.following ? `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` : "none",
                background: u.following ? "transparent" : "#3F3DF2",
                color: u.following ? (dark ? "#B8B6AD" : "#4A4938") : "white",
              }}
            >
              {loadingId === u.id ? <Loader2 size={12} className="linkly-spin" /> : u.following ? <Check size={12} /> : <UserPlus size={12} />}
              {u.following ? "Following" : "Follow"}
            </button>
            <button onClick={() => remove(u.id)} title="Remove suggestion" style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78" }}>
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Online friends</div>
        {seedOnline.map((o) => (
          <button key={o.id} onClick={() => onOpenChat(o.name)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: "none", border: "none", cursor: "pointer", width: "100%", padding: 0 }}>
            <div style={{ position: "relative" }}>
              <Avatar name={o.name} size={28} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", background: "#2ECC71", border: `2px solid ${dark ? "#14131F" : "#FAFAF7"}` }} />
            </div>
            <span style={{ fontSize: 12.5, color: "inherit" }}>{o.name}</span>
          </button>
        ))}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
          <TrendingUp size={15} /> Trending
        </div>
        {trending.map((t) => (
          <div key={t.id} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#3F3DF2" }}>{t.tag}</div>
            <div style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78" }}>{t.posts}</div>
          </div>
        ))}
      </div>

      <AdSlot dark={dark} />
    </div>
  );
}

function PostMenu({ dark, saved, onSave, onDelete, onHide, onCopyLink, isOwn }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const item = (Icon, label, onClick, danger) => (
    <button
      onClick={() => { onClick(); setOpen(false); }}
      style={{
        display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 12px",
        background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'Inter', sans-serif",
        color: danger ? "#FF5D6C" : "inherit", borderRadius: 7, textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "#242331" : "#F2F0E8")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 4 }}>
        <MoreHorizontal size={17} />
      </button>
      {open && (
        <div
          className="linkly-slidein"
          style={{
            position: "absolute", right: 0, top: 26, width: 190, background: dark ? "#1B1A28" : "white",
            border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 10, padding: 5, zIndex: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {item(Bookmark, saved ? "Unsave post" : "Save post", onSave)}
          {isOwn && item(Pencil, "Edit post", () => {})}
          {item(Copy, "Copy link", onCopyLink)}
          {item(HideIcon, "Hide post", onHide)}
          {item(Flag, "Report post", () => {})}
          {isOwn && item(Trash2, "Delete post", onDelete, true)}
        </div>
      )}
    </div>
  );
}

function CreatePostModal({ dark, onClose, onPublish }) {
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [feeling, setFeeling] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef(null);
  const max = 280;

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!text.trim() && !image) return;
    setPosting(true);
    setTimeout(() => {
      onPublish({ text: text.trim(), image, privacy, feeling });
      setPosting(false);
    }, 550);
  };

  const PrivacyIcon = PRIVACY_OPTIONS.find((p) => p.id === privacy).Icon;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,16,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="linkly-slidein"
        style={{ width: 440, maxWidth: "100%", maxHeight: "85vh", overflowY: "auto", background: dark ? "#1B1A28" : "white", borderRadius: 16, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15 }}>Create post</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={18} /></button>
        </div>

        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <Avatar name="You" size={38} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>You</div>
              <button
                onClick={() => setShowPrivacy((s) => !s)}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, background: dark ? "#242331" : "#F2F0E8", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "inherit", marginTop: 3, position: "relative" }}
              >
                <PrivacyIcon size={11} /> {PRIVACY_OPTIONS.find((p) => p.id === privacy).label}
                {showPrivacy && (
                  <div className="linkly-slidein" style={{ position: "absolute", top: 24, left: 0, background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 8, padding: 4, width: 130, zIndex: 5 }}>
                    {PRIVACY_OPTIONS.map((p) => (
                      <div key={p.id} onClick={(e) => { e.stopPropagation(); setPrivacy(p.id); setShowPrivacy(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", fontSize: 12, borderRadius: 5, cursor: "pointer" }}>
                        <p.Icon size={12} /> {p.label}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            </div>
          </div>

          <textarea
            autoFocus
            value={text}
            maxLength={max}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            style={{ width: "100%", border: "none", outline: "none", resize: "none", background: "transparent", color: "inherit", fontSize: 15, fontFamily: "'Inter', sans-serif" }}
          />

          {feeling && (
            <div style={{ fontSize: 13, color: dark ? "#B8B6AD" : "#4A4938", marginBottom: 8 }}>
              feeling {feeling} <button onClick={() => setFeeling("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF5D6C" }}>×</button>
            </div>
          )}

          {image && (
            <div style={{ position: "relative", marginBottom: 10 }}>
              <img src={image} alt="upload preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10 }} />
              <button onClick={() => setImage(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={13} color="white" />
              </button>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 10, padding: "8px 12px", marginTop: 6 }}>
            <span style={{ fontSize: 12.5, color: dark ? "#9C9A90" : "#6B6A5A" }}>Add to your post</span>
            <div style={{ display: "flex", gap: 4, position: "relative" }}>
              <button onClick={() => fileRef.current?.click()} title="Photo" style={roundIconBtn}>
                <ImageIcon size={16} color="#2ECC71" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} style={{ display: "none" }} />
              <button title="Video" style={roundIconBtn}><Video size={16} color="#3F3DF2" /></button>
              <button onClick={() => setShowFeelings((s) => !s)} title="Feeling" style={roundIconBtn}><Smile size={16} color="#FFB13F" /></button>
              <button title="Location" style={roundIconBtn}><MapPin size={16} color="#FF5D6C" /></button>
              {showFeelings && (
                <div className="linkly-slidein" style={{ position: "absolute", bottom: 34, right: 0, background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 8, padding: 5, width: 160, zIndex: 5 }}>
                  {FEELINGS.map((f) => (
                    <div key={f} onClick={() => { setFeeling(f); setShowFeelings(false); }} style={{ padding: "6px 8px", fontSize: 12.5, borderRadius: 5, cursor: "pointer" }}>{f}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 11, color: text.length > max - 20 ? "#FF5D6C" : (dark ? "#7A7869" : "#8C8A78") }}>{text.length}/{max}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={{ fontSize: 13, fontWeight: 600, background: "none", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "inherit" }}>Cancel</button>
              <button
                onClick={submit}
                disabled={(!text.trim() && !image) || posting}
                style={{ fontSize: 13, fontWeight: 600, background: "#3F3DF2", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, opacity: (!text.trim() && !image) ? 0.5 : 1 }}
              >
                {posting && <Loader2 size={13} className="linkly-spin" />} {posting ? "Posting" : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const roundIconBtn = { background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 7 };

const RECENT_SEARCHES_SEED = ["mural", "@priyan", "#SeptemberPlants"];

function SearchBar({ dark, posts, people, onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(RECENT_SEARCHES_SEED);
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setLoading(false); return; }
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const q = query.trim().toLowerCase();
  const matchedPeople = q ? people.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedPosts = q ? posts.filter((p) => p.content?.toLowerCase().includes(q)).slice(0, 3) : [];
  const matchedTags = q ? seedTrending.filter((t) => t.tag.toLowerCase().includes(q)).slice(0, 3) : [];
  const hasResults = matchedPeople.length || matchedPosts.length || matchedTags.length;

  const commit = (term) => {
    setQuery(term);
    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 5));
  };

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 360 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: dark ? "#7A7869" : "#8C8A78", border: `1px solid ${open ? "#3F3DF2" : "transparent"}`, borderRadius: 8, padding: "6px 10px", background: dark ? "#1B1A28" : "#F2F0E8" }}>
        <Search size={15} />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Linkly"
          style={{ border: "none", outline: "none", background: "transparent", color: "inherit", fontSize: 13, width: "100%" }}
        />
        {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={13} /></button>}
      </div>

      {open && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 42, left: 0, width: 320, background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 10, padding: 10, zIndex: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", maxHeight: 360, overflowY: "auto" }}>
          {!q && (
            <>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 6 }}>Recent searches</div>
              {recent.map((r) => (
                <div key={r} onClick={() => commit(r)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 6px", fontSize: 13, cursor: "pointer", borderRadius: 6 }}>
                  <Clock size={13} color={dark ? "#7A7869" : "#8C8A78"} /> {r}
                </div>
              ))}
            </>
          )}
          {q && loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 6px", fontSize: 13, color: dark ? "#7A7869" : "#8C8A78" }}>
              <Loader2 size={14} className="linkly-spin" /> Searching…
            </div>
          )}
          {q && !loading && !hasResults && (
            <div style={{ padding: "14px 6px", fontSize: 13, color: dark ? "#7A7869" : "#8C8A78" }}>No results for "{query}"</div>
          )}
          {q && !loading && matchedPeople.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", margin: "4px 0 4px" }}>People</div>
              {matchedPeople.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px", borderRadius: 6, cursor: "pointer" }}>
                  <Avatar name={p.name} size={26} /> <span style={{ fontSize: 13 }}>{p.name}</span>
                </div>
              ))}
            </div>
          )}
          {q && !loading && matchedTags.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", margin: "4px 0 4px" }}>Hashtags</div>
              {matchedTags.map((t) => (
                <div key={t.id} onClick={() => onNavigate("explore")} style={{ padding: "6px", fontSize: 13, color: "#3F3DF2", cursor: "pointer", borderRadius: 6 }}>{t.tag}</div>
              ))}
            </div>
          )}
          {q && !loading && matchedPosts.length > 0 && (
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", margin: "4px 0 4px" }}>Posts</div>
              {matchedPosts.map((p) => (
                <div key={p.id} onClick={() => onNavigate("feed")} style={{ padding: "6px", fontSize: 12.5, color: dark ? "#D8D6CC" : "#33321F", cursor: "pointer", borderRadius: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}: {p.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationPanel({ dark, notifs, setNotifs, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  return (
    <div ref={ref} className="linkly-slidein" style={{ position: "absolute", top: 44, right: 90, width: 320, maxHeight: 400, overflowY: "auto", background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", zIndex: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14 }}>Notifications</span>
        <button onClick={() => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))} style={{ background: "none", border: "none", color: "#3F3DF2", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          Mark all read
        </button>
      </div>
      {notifs.map((n) => {
        const Icon = NOTIF_ICON[n.kind];
        return (
          <div
            key={n.id}
            onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: n.read ? "transparent" : (dark ? "#20202E" : "#F7F6F0") }}
          >
            <div style={{ position: "relative" }}>
              <Avatar name={n.name} size={30} />
              <div style={{ position: "absolute", bottom: -3, right: -3, width: 15, height: 15, borderRadius: "50%", background: NOTIF_COLOR[n.kind], display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${dark ? "#1B1A28" : "white"}` }}>
                <Icon size={8} color="white" />
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 12.5 }}>
              <span style={{ fontWeight: 600 }}>{n.name}</span> <span style={{ color: dark ? "#B8B6AD" : "#4A4938" }}>{n.text}</span>
              <div style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78", marginTop: 2 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3F3DF2", flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  );
}

function Landing({ onGoLogin, onGoRegister, dark }) {
  const [revealed, setRevealed] = useState(false);
  const line = dark ? "#2C2B39" : "#E7E5DE";
  const sub = dark ? "#9C9A90" : "#6B6A5A";
  const card = dark ? "#1B1A28" : "white";

  const FEATURES = [
    { Icon: Home, color: "#3F3DF2", title: "Feed", body: "Post, like, comment, share — the parts of a social feed people actually use." },
    { Icon: EyeOff, color: "#FF5D6C", title: "Anonymous inbox", body: "A personal link anyone can message. Only you decide what happens next." },
    { Icon: Shuffle, color: "#3F3DF2", title: "Stranger chat", body: "Talk to someone new. Identities reveal gradually, never all at once." },
    { Icon: Film, color: "#FFB13F", title: "Reels & Live", body: "Short vertical video, plus real live streaming with live chat and reactions." },
    { Icon: Users, color: "#2ECC71", title: "Group chats", body: "Create a group, admin the members, or make any 1:1 chat 'romantic mode'." },
    { Icon: Coins, color: "#FFB13F", title: "Earn coins", body: "Watch a rewarded ad or check in daily, then redeem coins on perks in-app." },
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        background: dark ? "#14131F" : "#FAFAF7",
        color: dark ? "#F2F1EC" : "#14131F",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @keyframes linkly-sharpen { from { filter: blur(9px); opacity: 0.35; } to { filter: blur(0); opacity: 1; } }
        .linkly-headline-veiled { animation: linkly-sharpen 1.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
      `}</style>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LinklyMark size={28} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em" }}>linkly</span>
          </div>
          <button
            onClick={onGoLogin}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13.5, background: "transparent", color: "inherit", border: `1.5px solid ${line}`, borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}
          >
            Open app
          </button>
        </div>

        {/* Hero: the whole product tension, stated once, typographically */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 64, alignItems: "start", marginBottom: 120 }}>
          <div>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(42px, 5.6vw, 68px)",
                lineHeight: 1.03,
                letterSpacing: "-0.03em",
                margin: "0 0 28px",
              }}
            >
              Say it with your name.
              <br />
              <span className="linkly-headline-veiled">Or say it without one.</span>
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.65, color: sub, maxWidth: 460, margin: "0 0 32px" }}>
              Linkly is a social feed and an anonymous inbox, in the same app.
              Post under your name, or open a line anyone can write into without
              revealing who they are. You decide, post by post.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onGoRegister}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, background: dark ? "#F2F1EC" : "#14131F", color: dark ? "#14131F" : "white", border: "none", borderRadius: 8, padding: "13px 22px", cursor: "pointer" }}
              >
                Create account
              </button>
              <button
                onClick={onGoLogin}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, background: "transparent", color: "inherit", border: `1.5px solid ${line}`, borderRadius: 8, padding: "13px 22px", cursor: "pointer" }}
              >
                See the feed
              </button>
            </div>
          </div>

          {/* The one hero artifact: the product's actual gradual-reveal mechanic, made interactive */}
          <div style={{ background: card, border: `1px solid ${line}`, borderRadius: 16, padding: 22, boxShadow: dark ? "0 20px 48px rgba(0,0,0,0.35)" : "0 20px 48px rgba(20,19,31,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "#FF5D6C", marginBottom: 14 }}>
              <EyeOff size={12} /> anonymous message
            </div>
            <div
              onClick={() => setRevealed((r) => !r)}
              style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 16 }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: revealed ? undefined : (dark ? "#242331" : "#E7E5DE"), display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.4s ease" }}>
                {revealed ? <Avatar name="Kai Fernandez" size={30} /> : <EyeOff size={13} color={sub} />}
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.5, filter: revealed ? "blur(0)" : "blur(5px)", transition: "filter 0.5s ease", userSelect: "none" }}>
                your presentation today was so clear, wish more people explained things like that
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: sub, borderTop: `1px solid ${line}`, paddingTop: 12 }}>
              {revealed ? "Kai Fernandez chose to reveal their name." : "Tap to see how a name reveals in Linkly — nothing shows until someone chooses to."}
            </div>
          </div>
        </div>

        {/* Features: an editorial list, not a grid of identical cards */}
        <div style={{ marginBottom: 112 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(24px, 3vw, 30px)", letterSpacing: "-0.02em", marginBottom: 4 }}>
            One app, both sides of you
          </div>
          <p style={{ fontSize: 14, color: sub, marginBottom: 8 }}>Everything below ships in Linkly — not a roadmap.</p>

          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "26px 0",
                borderTop: `1px solid ${line}`,
                borderBottom: i === FEATURES.length - 1 ? `1px solid ${line}` : "none",
              }}
            >
              <f.Icon size={22} color={f.color} style={{ flexShrink: 0 }} />
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, width: 190, flexShrink: 0 }}>{f.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: sub, maxWidth: 480 }}>{f.body}</div>
            </div>
          ))}
        </div>

        {/* Close: quiet and confident, not a gradient banner */}
        <div style={{ textAlign: "center", padding: "0 0 64px" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 36px)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Ready to say it — your way?
          </div>
          <button
            onClick={onGoRegister}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "13px 30px", cursor: "pointer" }}
          >
            Create your account
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${line}`, padding: "22px 0 40px", fontSize: 12, color: sub }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LinklyMark size={16} /> Linkly
          </div>
          <span>Connect. Share. Express.</span>
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, type = "text", value, onChange, error, dark, autoFocus, showToggle, visible, onToggleVisible }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: dark ? "#B8B6AD" : "#4A4938" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          autoFocus={autoFocus}
          type={showToggle ? (visible ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          style={{
            width: "100%", fontSize: 14, padding: showToggle ? "10px 40px 10px 12px" : "10px 12px",
            borderRadius: 9, border: `1.5px solid ${error ? "#FF5D6C" : (dark ? "#2C2B39" : "#E7E5DE")}`,
            background: "transparent", color: "inherit", outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisible}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78", display: "flex" }}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: 11.5, color: "#FF5D6C", marginTop: 5 }}>{error}</div>}
    </div>
  );
}

function AuthScreen({ mode, dark, onSwitchMode, onBackToLanding, onLogin, onRegister }) {
  const [fields, setFields] = useState({ name: "", username: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [sent, setSent] = useState(false);
  const line = dark ? "#2C2B39" : "#E7E5DE";
  const sub = dark ? "#9C9A90" : "#6B6A5A";

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));
  const validUsername = (v) => /^[a-zA-Z0-9_]{3,20}$/.test(v.trim());

  const submit = () => {
    const e = {};
    if (mode === "register" && !fields.name.trim()) e.name = "Enter your name";
    if (!validUsername(fields.username)) e.username = "3–20 characters: letters, numbers, underscores";
    if (mode !== "forgot" && fields.password.length < 6) e.password = "At least 6 characters";
    if (mode === "register" && fields.confirm !== fields.password) e.confirm = "Passwords don't match";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (mode === "login") onLogin();
    else if (mode === "register") onRegister(fields.name.trim());
    else if (mode === "forgot") setSent(true);
  };

  const titles = { login: "Log in", register: "Create your account", forgot: "Reset your password" };

  return (
    <div style={{ minHeight: "100%", background: dark ? "#14131F" : "#FAFAF7", color: dark ? "#F2F1EC" : "#14131F", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: 380, maxWidth: "100%" }}>
        <button onClick={onBackToLanding} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: sub, fontSize: 12.5, fontWeight: 600, marginBottom: 28, padding: 0 }}>
          <ChevronLeft size={15} /> Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 26 }}>
          <LinklyMark size={26} />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>linkly</span>
        </div>

        {mode === "forgot" && sent ? (
          <>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Check your inbox</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: sub, marginBottom: 24 }}>
              If an account exists for <b style={{ color: "inherit" }}>@{fields.username}</b>, we've sent reset instructions to the contact info on file.
            </p>
            <button onClick={() => onSwitchMode("login")} style={{ width: "100%", background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Back to log in
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: "-0.01em", marginBottom: 8 }}>{titles[mode]}</div>
            {mode === "forgot" && (
              <p style={{ fontSize: 13, lineHeight: 1.55, color: sub, marginBottom: 22 }}>
                Enter the username on your account and we'll send reset instructions.
              </p>
            )}

            <div style={{ marginTop: mode === "forgot" ? 0 : 22 }}>
              {mode === "register" && (
                <AuthField label="Name" value={fields.name} onChange={set("name")} error={errors.name} dark={dark} autoFocus />
              )}
              <AuthField label="Username" value={fields.username} onChange={set("username")} error={errors.username} dark={dark} autoFocus={mode !== "register"} />
              {mode !== "forgot" && (
                <AuthField label="Password" value={fields.password} onChange={set("password")} error={errors.password} dark={dark} showToggle visible={showPw} onToggleVisible={() => setShowPw((v) => !v)} />
              )}
              {mode === "register" && (
                <AuthField label="Confirm password" value={fields.confirm} onChange={set("confirm")} error={errors.confirm} dark={dark} showToggle visible={showConfirmPw} onToggleVisible={() => setShowConfirmPw((v) => !v)} />
              )}
            </div>

            {mode === "login" && (
              <button onClick={() => onSwitchMode("forgot")} style={{ background: "none", border: "none", color: "#3F3DF2", fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 20 }}>
                Forgot password?
              </button>
            )}

            <button
              onClick={submit}
              style={{ width: "100%", background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "12px", fontSize: 14.5, fontWeight: 700, cursor: "pointer", marginTop: mode === "login" ? 0 : 8, marginBottom: 18 }}
            >
              {mode === "login" ? "Log in" : mode === "register" ? "Create account" : "Send reset link"}
            </button>

            <div style={{ textAlign: "center", fontSize: 13, color: sub }}>
              {mode === "login" && <>New to Linkly? <button onClick={() => onSwitchMode("register")} style={{ background: "none", border: "none", color: "#3F3DF2", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>Sign up</button></>}
              {mode === "register" && <>Already have an account? <button onClick={() => onSwitchMode("login")} style={{ background: "none", border: "none", color: "#3F3DF2", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>Log in</button></>}
              {mode === "forgot" && <>Remembered it? <button onClick={() => onSwitchMode("login")} style={{ background: "none", border: "none", color: "#3F3DF2", fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>Log in</button></>}
            </div>
          </>
        )}

        <div style={{ marginTop: 32, fontSize: 11, color: sub, lineHeight: 1.6, borderTop: `1px solid ${line}`, paddingTop: 16 }}>
          Demo only — this doesn't create a real account. Any username (3–20 characters) and a 6+ character password will work.
        </div>
      </div>
    </div>
  );
}

function NavRail({ active, setActive, dark, collapsed, setCollapsed, unreadAnon, unreadMsgs, unreadNotifs, name, bio, avatarUrl }) {
  const items = [
    ["feed", Home, "Home", 0],
    ["reels", Film, "Reels", 0],
    ["explore", Compass, "Explore", 0],
    ["anon", EyeOff, "Anonymous", unreadAnon],
    ["stranger", Shuffle, "Stranger Chat", 0],
    ["messages", MessageCircle, "Messages", unreadMsgs],
    ["notifications", Bell, "Notifications", unreadNotifs],
    ["earn", Coins, "Earn coins", 0],
    ["settings", Settings, "Settings", 0],
  ];
  const profileActive = active === "profile";
  return (
    <div
      style={{
        width: collapsed ? 68 : 220,
        flexShrink: 0,
        padding: "24px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: `1px solid ${dark ? "#242331" : "#E7E5DE"}`,
        transition: "width 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "0 6px 18px" }}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} title="Expand sidebar" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <LinklyMark size={26} />
          </button>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <LinklyMark size={24} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>linkly</span>
            </div>
            <button onClick={() => setCollapsed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78", padding: 4 }}>
              <PanelLeftClose size={17} />
            </button>
          </>
        )}
      </div>

      <button
        title={collapsed ? "Profile" : undefined}
        onClick={() => setActive("profile")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: collapsed ? "8px" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 10,
          border: `1px solid ${profileActive ? "#3F3DF2" : "transparent"}`,
          background: profileActive ? (dark ? "#242331" : "#EFEEE6") : (dark ? "#1B1A28" : "#F7F6F0"),
          cursor: "pointer",
          textAlign: "left",
          marginBottom: 16,
          width: "100%",
        }}
      >
        <MyAvatar name={name || "You"} avatarUrl={avatarUrl} size={30} />
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name || "You"}</div>
            <div style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>View profile</div>
          </div>
        )}
      </button>

      {items.map(([key, Icon, label, badge]) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            title={collapsed ? label : undefined}
            onClick={() => setActive(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: collapsed ? "10px" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              position: "relative",
              borderRadius: 8,
              border: "none",
              background: isActive ? (dark ? "#242331" : "#EFEEE6") : "transparent",
              borderLeft: isActive ? "3px solid #3F3DF2" : "3px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'Inter', sans-serif",
              fontWeight: isActive ? 600 : 500,
              fontSize: 14,
              color: "inherit",
            }}
          >
            <span style={{ position: "relative", display: "flex" }}>
              <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
              {badge > 0 && (
                <span style={{ position: "absolute", top: -5, right: collapsed ? -5 : -6, background: "#FF5D6C", color: "white", fontSize: 8.5, fontWeight: 700, borderRadius: "50%", minWidth: 13, height: 13, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>
                  {badge}
                </span>
              )}
            </span>
            {!collapsed && label}
          </button>
        );
      })}
    </div>
  );
}

function MobileNav({ active, setActive, dark, unreadAnon, unreadMsgs, unreadNotifs }) {
  const items = [
    ["feed", Home], ["reels", Film], ["explore", Compass], ["anon", EyeOff], ["stranger", Shuffle], ["messages", MessageCircle], ["notifications", Bell], ["profile", User],
  ];
  const badges = { anon: unreadAnon, messages: unreadMsgs, notifications: unreadNotifs };
  return (
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 4px", borderTop: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, background: dark ? "#14131F" : "#FAFAF7" }}>
      {items.map(([key, Icon]) => (
        <button key={key} onClick={() => setActive(key)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: active === key ? "#3F3DF2" : (dark ? "#7A7869" : "#8C8A78"), padding: 6 }}>
          <Icon size={20} strokeWidth={active === key ? 2.4 : 2} />
          {badges[key] > 0 && <span style={{ position: "absolute", top: 2, right: 2, width: 7, height: 7, borderRadius: "50%", background: "#FF5D6C" }} />}
        </button>
      ))}
    </div>
  );
}

const MORE_POSTS = [
  { id: "m1", name: "Teo Villanueva", handle: "@teov", time: "2d", content: "Refactored the whole onboarding flow today. Deleted more code than I wrote, best kind of day.", likes: 27, comments: [] },
  { id: "m2", name: "Rhea Domingo", handle: "@rhead", time: "3d", content: "Sunset over the bay tonight was unreal. Should've brought a real camera.", likes: 61, comments: [] },
];

function SponsoredCard({ dark, sponsor, onCta }) {
  return (
    <div style={{ background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 12, padding: 14, marginBottom: 14, overflow: "hidden" }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Sponsored</div>
      <div className="linkly-reel-bg" style={{ height: 120, borderRadius: 9, background: sponsor.gradient, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "white", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>{sponsor.brand}</span>
      </div>
      <div style={{ fontSize: 13.5, marginBottom: 10 }}>{sponsor.tagline}</div>
      <button onClick={onCta} style={{ width: "100%", background: dark ? "#242331" : "#F2F0E8", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 12.5, fontWeight: 700, cursor: "pointer", color: "#3F3DF2" }}>
        {sponsor.cta}
      </button>
    </div>
  );
}

function Feed({ posts, setPosts, dark, stories, onOpenStory, onAddStory, onGoLive, onOpenReels, onOpenAnon, onOpenStranger, adFreeActive }) {
  const [toast, setToast] = useState("");
  const [poppedId, setPoppedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);
  const hoverTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const setReaction = (id, reactionId) => {
    setPosts((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p;
        const wasReacted = !!p.reaction;
        const isSame = p.reaction === reactionId;
        const nextReaction = isSame ? null : reactionId;
        const nextCount = p.likes + (nextReaction ? (wasReacted ? 0 : 1) : -1);
        return { ...p, reaction: nextReaction, likes: Math.max(0, nextCount) };
      })
    );
    setPickerFor(null);
    setPoppedId(id);
    setTimeout(() => setPoppedId(null), 320);
  };

  const quickLikeClick = (p) => setReaction(p.id, p.reaction ? p.reaction : "like");

  const openPickerSoon = (id) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPickerFor(id), 420);
  };
  const cancelPickerSoon = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPickerFor(null), 250);
  };

  const toggleComments = (id) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, showComments: !p.showComments } : p)));

  const setCommentDraft = (id, v) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, commentDraft: v } : p)));

  const submitComment = (id) =>
    setPosts((ps) =>
      ps.map((p) =>
        p.id === id && p.commentDraft.trim()
          ? { ...p, comments: [...p.comments, { id: "c" + Date.now(), name: "You", text: p.commentDraft.trim() }], commentDraft: "" }
          : p
      )
    );

  const publish = ({ text, image, privacy, feeling }) => {
    setPosts((ps) => [
      { id: "p" + Date.now(), name: "You", handle: "@you", time: "now", content: text, image, privacy, feeling, likes: 0, liked: false, comments: [], commentDraft: "", showComments: false, saved: false, hidden: false, isOwn: true },
      ...ps,
    ]);
    setShowModal(false);
    showToast("Posted!");
  };

  const toggleSave = (id) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
    const p = posts.find((x) => x.id === id);
    showToast(p?.saved ? "Removed from saved" : "Saved post");
  };
  const hidePost = (id) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, hidden: true } : p)));
    showToast("Post hidden");
  };
  const deletePost = (id) => {
    setPosts((ps) => ps.filter((p) => p.id !== id));
    showToast("Post deleted");
  };
  const copyLink = (id) => showToast("Link copied");

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setPosts((ps) => [...ps, ...MORE_POSTS.map((p) => ({ ...p, liked: false, commentDraft: "", showComments: false, saved: false, hidden: false }))]);
      setLoadingMore(false);
      setExhausted(true);
    }, 700);
  };

  const cardStyle = {
    background: dark ? "#1B1A28" : "white",
    border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`,
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
  };

  const visible = posts.filter((p) => !p.hidden);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px", position: "relative" }}>
      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 6, right: 20, background: "#14131F", color: "white", fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 8, zIndex: 5 }}>
          {toast}
        </div>
      )}
      <StoriesBar stories={stories} onOpen={onOpenStory} dark={dark} onAddStory={onAddStory} />
      {adFreeActive && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#2ECC71", fontWeight: 600, marginBottom: 10 }}>
          <EyeOff size={12} /> Ad-free is active — sponsored posts are hidden
        </div>
      )}

      <div onClick={() => setShowModal(true)} style={{ ...cardStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <Avatar name="You" size={36} />
        <div style={{ flex: 1, padding: "9px 14px", borderRadius: 20, background: dark ? "#242331" : "#F2F0E8", fontSize: 14, color: dark ? "#7A7869" : "#8C8A78" }}>
          What's on your mind?
        </div>
        <ImageIcon size={18} color="#2ECC71" />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: dark ? "#1B1A28" : "white",
          border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`,
          borderTop: `1px solid ${dark ? "#2C2B39" : "#EFEEE6"}`,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        {[
          ["Live video", Radio, "#FF5D6C", onGoLive],
          ["Photo/video", ImageIcon, "#2ECC71", () => setShowModal(true)],
          ["Reel", Film, "#3F3DF2", onOpenReels],
          ["Anonymous", EyeOff, "#FF5D6C", onOpenAnon],
          ["Stranger chat", Shuffle, "#3F3DF2", onOpenStranger],
        ].map(([label, Icon, color, onClick]) => (
          <button
            key={label}
            onClick={onClick}
            style={{ flex: "1 1 30%", minWidth: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "none", border: "none", padding: "11px 4px", cursor: "pointer", fontSize: 12, fontWeight: 600, color: dark ? "#B8B6AD" : "#4A4938" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "#242331" : "#F7F6F0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Icon size={16} color={color} /> {label}
          </button>
        ))}
      </div>

      {showModal && <CreatePostModal dark={dark} onClose={() => setShowModal(false)} onPublish={publish} />}

      {visible.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: dark ? "#7A7869" : "#8C8A78", fontSize: 14 }}>
          Nothing here yet. Be the first to post something.
        </div>
      )}

      {visible.map((p, i) => (
        <React.Fragment key={p.id}>
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <Avatar name={p.name} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: dark ? "#7A7869" : "#8C8A78", display: "flex", alignItems: "center", gap: 5 }}>
                {p.handle} · {p.time}
                {p.privacy && (p.privacy === "public" ? <Globe size={10} /> : p.privacy === "friends" ? <Users size={10} /> : <Lock size={10} />)}
                {p.feeling && <span>· feeling {p.feeling}</span>}
              </div>
            </div>
            <PostMenu
              dark={dark}
              saved={p.saved}
              isOwn={!!p.isOwn}
              onSave={() => toggleSave(p.id)}
              onDelete={() => deletePost(p.id)}
              onHide={() => hidePost(p.id)}
              onCopyLink={() => copyLink(p.id)}
            />
          </div>
          {p.content && <div style={{ fontSize: 14.5, lineHeight: 1.55, marginBottom: p.image ? 10 : 12 }}>{p.content}</div>}
          {p.image && <img src={p.image} alt="post" style={{ width: "100%", maxHeight: 340, objectFit: "cover", borderRadius: 10, marginBottom: 12 }} />}
          <div style={{ display: "flex", gap: 18, paddingTop: 8, borderTop: `1px solid ${dark ? "#2C2B39" : "#EFEEE6"}` }}>
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => openPickerSoon(p.id)}
              onMouseLeave={cancelPickerSoon}
            >
              {pickerFor === p.id && (
                <div
                  className="linkly-slidein"
                  onMouseEnter={() => clearTimeout(hoverTimer.current)}
                  onMouseLeave={cancelPickerSoon}
                  style={{
                    position: "absolute", bottom: "100%", left: 0, marginBottom: 6,
                    display: "flex", gap: 2, background: dark ? "#1B1A28" : "white",
                    border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 24,
                    padding: 5, boxShadow: "0 6px 20px rgba(0,0,0,0.18)", zIndex: 8,
                  }}
                >
                  {REACTIONS.map((r) => (
                    <button
                      key={r.id}
                      title={r.label}
                      onClick={() => setReaction(p.id, r.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer", fontSize: 20,
                        padding: 4, borderRadius: "50%", lineHeight: 1,
                        transform: p.reaction === r.id ? "scale(1.25)" : "scale(1)",
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.35)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = p.reaction === r.id ? "scale(1.25)" : "scale(1)")}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => quickLikeClick(p)} style={iconBtn(dark)}>
                {p.reaction ? (
                  <span className={poppedId === p.id ? "linkly-pop" : ""} style={{ fontSize: 15, lineHeight: 1 }}>
                    {REACTIONS.find((r) => r.id === p.reaction)?.emoji}
                  </span>
                ) : (
                  <Heart size={16} className={poppedId === p.id ? "linkly-pop" : ""} />
                )}
                <span style={{ fontWeight: p.reaction ? 600 : 400, color: p.reaction ? REACTIONS.find((r) => r.id === p.reaction)?.color : "inherit" }}>
                  {p.likes}
                </span>
              </button>
            </div>
            <button onClick={() => toggleComments(p.id)} style={iconBtn(dark)}>
              <MessageSquare size={16} />
              <span>{p.comments.length}</span>
            </button>
            <button onClick={() => copyLink(p.id)} style={iconBtn(dark)}>
              <Share2 size={16} />
            </button>
            <button onClick={() => toggleSave(p.id)} style={{ ...iconBtn(dark), marginLeft: "auto" }}>
              <Bookmark size={16} fill={p.saved ? "#3F3DF2" : "none"} color={p.saved ? "#3F3DF2" : "currentColor"} />
            </button>
          </div>

          {p.showComments && (
            <div className="linkly-slidein" style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${dark ? "#2C2B39" : "#EFEEE6"}` }}>
              {p.comments.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <Avatar name={c.name} size={24} />
                  <div>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>{" "}
                    <span style={{ color: dark ? "#B8B6AD" : "#4A4938" }}>{c.text}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input
                  value={p.commentDraft}
                  onChange={(e) => setCommentDraft(p.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment(p.id)}
                  placeholder="Write a comment"
                  style={{ flex: 1, fontSize: 13, padding: "7px 10px", borderRadius: 7, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
                />
                <button onClick={() => submitComment(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3F3DF2" }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        {!adFreeActive && (i + 1) % 3 === 0 && <SponsoredCard dark={dark} sponsor={SPONSORS[Math.floor(i / 3) % SPONSORS.length]} onCta={() => showToast("This is a demo ad — no real link")} />}
        </React.Fragment>
      ))}

      {!exhausted && visible.length > 0 && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 10, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {loadingMore ? <><Loader2 size={14} className="linkly-spin" /> Loading</> : "Load more posts"}
        </button>
      )}
      {exhausted && <div style={{ textAlign: "center", fontSize: 12.5, color: dark ? "#7A7869" : "#8C8A78", padding: 10 }}>You're caught up</div>}
    </div>
  );
}

function iconBtn(dark) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: dark ? "#9C9A90" : "#6B6A5A",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
  };
}

function AnonymousInbox({ messages, setMessages, dark }) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("all");
  const [toast, setToast] = useState("");
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [blocked, setBlocked] = useState(0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1800); };
  const del = (id) => { setMessages((ms) => ms.filter((m) => m.id !== id)); showToast("Message deleted"); };
  const markRead = (id) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: true } : m)));
  const report = (id) => { setMessages((ms) => ms.filter((m) => m.id !== id)); showToast("Reported — thanks, we'll review it"); };
  const block = (id) => { setMessages((ms) => ms.filter((m) => m.id !== id)); setBlocked((b) => b + 1); showToast("Sender blocked"); };
  const sendReply = (id) => {
    if (!replyText.trim()) return;
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, replied: true, reply: replyText.trim() } : m)));
    setReplyId(null);
    setReplyText("");
    showToast("Reply sent");
  };
  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (navigator.share) {
      navigator.share({ title: "My anonymous link", url: "https://linkly.app/ask/you" }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText("https://linkly.app/ask/you").catch(() => {});
    }
  };

  const filtered = messages.filter((m) => (tab === "unread" ? !m.read : tab === "replied" ? m.replied : true));
  const unreadCount = messages.filter((m) => !m.read).length;

  const tabs = [
    ["all", "All", messages.length],
    ["unread", "Unread", unreadCount],
    ["replied", "Replied", messages.filter((m) => m.replied).length],
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px", position: "relative" }}>
      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 6, right: 20, background: "#14131F", color: "white", fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 8, zIndex: 5 }}>
          {toast}
        </div>
      )}

      <div style={{ background: "linear-gradient(135deg,#3F3DF2,#FF5D6C)", borderRadius: 16, padding: "26px 22px", marginBottom: 20, color: "white" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 4 }}>Linkly Anonymous</div>
        <div style={{ fontSize: 13.5, opacity: 0.92, marginBottom: 16, maxWidth: 380 }}>
          Let people tell you what they really think. Messages sent to your link never reveal who sent them — not even to us in this preview.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.16)", borderRadius: 10, padding: "10px 14px" }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>linkly.app/ask/you</span>
          <button onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: 6, background: "white", color: "#3F3DF2", border: "none", borderRadius: 7, padding: "7px 13px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
            <Link2 size={13} /> {copied ? "Copied" : "Copy / Share"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, opacity: 0.9 }}>
          <span>{messages.length} received</span>
          <span>{unreadCount} unread</span>
          {blocked > 0 && <span>{blocked} blocked</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: dark ? "#1B1A28" : "#F2F0E8", borderRadius: 10, padding: 4 }}>
        {tabs.map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tab === key ? (dark ? "#14131F" : "white") : "transparent",
              color: "inherit", fontSize: 12.5, fontWeight: 600,
              boxShadow: tab === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {label} {count > 0 && <span style={{ color: dark ? "#7A7869" : "#8C8A78" }}>· {count}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: dark ? "#7A7869" : "#8C8A78", fontSize: 14 }}>
          {tab === "all" ? "Your inbox is empty. Share your link to start receiving messages." : `No ${tab} messages.`}
        </div>
      )}

      {filtered.map((m) => (
        <div
          key={m.id}
          onClick={() => markRead(m.id)}
          className="linkly-slidein"
          style={{
            background: dark ? "#1B1A28" : "white",
            border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`,
            borderLeft: m.read ? `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` : "3px solid #FF5D6C",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>{m.text}</div>

          {m.replied && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13 }}>
              <Avatar name="You" size={22} />
              <div style={{ background: dark ? "#242331" : "#F2F0E8", borderRadius: 8, padding: "6px 10px", color: dark ? "#D8D6CC" : "#33321F" }}>{m.reply}</div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78" }}>{m.time} · anonymous</span>
            <div style={{ display: "flex", gap: 14 }} onClick={(e) => e.stopPropagation()}>
              {!m.replied && (
                <button onClick={() => setReplyId(replyId === m.id ? null : m.id)} style={iconBtn(dark)} title="Reply">
                  <Send size={14} />
                </button>
              )}
              <button onClick={() => report(m.id)} style={iconBtn(dark)} title="Report">
                <Flag size={14} />
              </button>
              <button onClick={() => block(m.id)} style={iconBtn(dark)} title="Block sender">
                <Ban size={14} />
              </button>
              <button onClick={() => del(m.id)} style={iconBtn(dark)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {replyId === m.id && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
              <input
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply(m.id)}
                placeholder="Reply — still shown to them as anonymous"
                style={{ flex: 1, fontSize: 13, padding: "8px 10px", borderRadius: 7, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
              />
              <button onClick={() => sendReply(m.id)} style={{ background: "#3F3DF2", border: "none", borderRadius: 7, padding: "0 12px", cursor: "pointer" }}>
                <Send size={14} color="white" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GroupAvatarCluster({ members, size = 34 }) {
  const shown = members.slice(0, 2);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {shown.map((m, i) => (
        <div key={m} style={{ position: "absolute", top: i * (size * 0.28), left: i * (size * 0.28), border: "2px solid transparent" }}>
          <Avatar name={m} size={size * 0.72} tone={i === 0 ? "signal" : "ping"} />
        </div>
      ))}
    </div>
  );
}

function NewGroupModal({ dark, candidates, onClose, onCreate }) {
  const [picked, setPicked] = useState([]);
  const [groupName, setGroupName] = useState("");

  const toggle = (name) => setPicked((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));

  const create = () => {
    if (picked.length === 0) return;
    onCreate(groupName.trim() || picked.slice(0, 2).join(" & ") + (picked.length > 2 ? ` +${picked.length - 2}` : ""), picked);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,16,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="linkly-slidein" style={{ width: 380, maxWidth: "100%", background: dark ? "#1B1A28" : "white", borderRadius: 16, padding: 20, color: "inherit" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16 }}>New group chat</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={17} /></button>
        </div>
        <input
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name (optional)"
          style={{ width: "100%", fontSize: 14, padding: "10px 12px", borderRadius: 9, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none", marginBottom: 14, boxSizing: "border-box" }}
        />
        <div style={{ fontSize: 12, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 8 }}>Add people</div>
        <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
          {candidates.map((name) => (
            <button
              key={name}
              onClick={() => toggle(name)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", borderRadius: 8, border: "none", background: picked.includes(name) ? (dark ? "#242331" : "#EFEEE6") : "transparent", cursor: "pointer", textAlign: "left" }}
            >
              <Avatar name={name} size={30} />
              <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{name}</span>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${picked.includes(name) ? "#3F3DF2" : (dark ? "#3A3947" : "#C9C7BB")}`, background: picked.includes(name) ? "#3F3DF2" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {picked.includes(name) && <Check size={12} color="white" />}
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, color: "inherit", borderRadius: 8, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={create} disabled={picked.length === 0} style={{ background: picked.length ? "#3F3DF2" : (dark ? "#2C2B39" : "#E7E5DE"), color: picked.length ? "white" : (dark ? "#6B6A5A" : "#A8A694"), border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: picked.length ? "pointer" : "default" }}>
            Create group
          </button>
        </div>
      </div>
    </div>
  );
}

function Messenger({ threads, setThreads, dark, activeThreadId, setActiveThreadId, candidates, coins, onSpendCoins, onGoEarn }) {
  const [activeId, setActiveId] = useState(activeThreadId || threads[0]?.id);
  const [draft, setDraft] = useState("");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [toast, setToast] = useState("");
  const active = threads.find((t) => t.id === activeId);
  const bottomRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1800); };

  useEffect(() => {
    if (activeThreadId) setActiveId(activeThreadId);
  }, [activeThreadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  const send = () => {
    if (!draft.trim() || !active) return;
    setThreads((ts) =>
      ts.map((t) => (t.id === active.id ? { ...t, messages: [...t.messages, { id: "m" + Date.now(), from: "me", text: draft.trim() }] } : t))
    );
    setDraft("");
  };

  const createGroup = (name, members) => {
    const id = "grp" + Date.now();
    setThreads((ts) => [
      { id, name, isGroup: true, online: true, romantic: false, members: [...members, "You"], admins: ["You"], messages: [{ id: "sys" + Date.now(), from: "system", text: `You created "${name}" with ${members.join(", ")}` }] },
      ...ts,
    ]);
    setActiveId(id);
    setShowNewGroup(false);
  };

  const toggleRomantic = () => {
    setThreads((ts) => ts.map((t) => (t.id === active.id ? { ...t, romantic: !t.romantic } : t)));
    showToast(active.romantic ? "Romantic mode off" : "Romantic mode on 💕");
  };

  const removeMember = (name) => {
    setThreads((ts) => ts.map((t) => (t.id === active.id ? { ...t, members: t.members.filter((m) => m !== name), messages: [...t.messages, { id: "sys" + Date.now(), from: "system", text: `You removed ${name}` }] } : t)));
  };

  const addMember = (name) => {
    setThreads((ts) => ts.map((t) => (t.id === active.id && !t.members.includes(name) ? { ...t, members: [...t.members, name], messages: [...t.messages, { id: "sys" + Date.now(), from: "system", text: `You added ${name}` }] } : t)));
  };

  const leaveOrDelete = () => {
    const isAdmin = active.admins?.includes("You");
    setThreads((ts) => ts.filter((t) => t.id !== active.id));
    setActiveId(threads.find((t) => t.id !== active.id)?.id);
    setShowGroupInfo(false);
    showToast(isAdmin ? "Group deleted" : "You left the group");
  };

  const isAdmin = active?.isGroup && active.admins?.includes("You");
  const addableCandidates = active?.isGroup ? candidates.filter((c) => !active.members.includes(c)) : [];

  const bubbleBg = (fromMe) => {
    if (active?.romantic) return fromMe ? "linear-gradient(135deg,#FF5D6C,#FF8FA3)" : (dark ? "#2A1820" : "#FFE4E9");
    return fromMe ? "#3F3DF2" : dark ? "#1B1A28" : "#EFEEE6";
  };

  return (
    <div style={{ display: "flex", height: "100%", position: "relative" }}>
      {showNewGroup && <NewGroupModal dark={dark} candidates={candidates} onClose={() => setShowNewGroup(false)} onCreate={createGroup} />}
      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 8, right: 16, background: "#14131F", color: "white", fontSize: 12, fontWeight: 600, padding: "7px 13px", borderRadius: 8, zIndex: 30 }}>
          {toast}
        </div>
      )}

      <div style={{ width: 240, borderRight: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, padding: "12px 8px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <button
          onClick={() => setShowNewGroup(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: dark ? "#242331" : "#F2F0E8", border: "none", borderRadius: 8, padding: "9px 10px", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "inherit", marginBottom: 10 }}
        >
          <Users size={15} /> New group chat
        </button>
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "9px 10px",
              borderRadius: 8,
              border: "none",
              background: activeId === t.id ? (dark ? "#242331" : "#EFEEE6") : "transparent",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: 2,
            }}
          >
            {t.isGroup ? (
              <GroupAvatarCluster members={t.members.filter((m) => m !== "You")} />
            ) : (
              <div style={{ position: "relative" }}>
                <Avatar name={t.name} size={34} />
                {t.online && <div style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: "#2ECC71", border: `2px solid ${dark ? "#14131F" : "#FAFAF7"}` }} />}
              </div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                {t.name} {t.romantic && <Heart size={11} fill="#FF5D6C" color="#FF5D6C" />}
              </div>
              <div style={{ fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.messages[t.messages.length - 1]?.text}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {active ? (
          <>
            {active.romantic && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="linkly-float-heart" style={{ left: `${10 + i * 15}%`, animationDelay: `${i * 1.3}s` }}>💗</span>
                ))}
              </div>
            )}

            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
              <div
                onClick={() => active.isGroup && setShowGroupInfo(true)}
                style={{ display: "flex", alignItems: "center", gap: 10, cursor: active.isGroup ? "pointer" : "default" }}
              >
                {active.isGroup ? <GroupAvatarCluster members={active.members.filter((m) => m !== "You")} size={32} /> : <Avatar name={active.name} size={30} />}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{active.name}</div>
                  <div style={{ fontSize: 11.5, color: active.isGroup ? (dark ? "#7A7869" : "#8C8A78") : (active.online ? "#2ECC71" : (dark ? "#7A7869" : "#8C8A78")) }}>
                    {active.isGroup ? `${active.members.length} members` : (active.online ? "Online" : "Offline")}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {!active.isGroup && (
                  <>
                    <button onClick={() => setShowCall(true)} title="Video call" style={iconBtn(dark)}>
                      <PhoneCall size={17} />
                    </button>
                    <button onClick={toggleRomantic} title="Romantic mode" style={{ ...iconBtn(dark), color: active.romantic ? "#FF5D6C" : (dark ? "#9C9A90" : "#6B6A5A") }}>
                      <Heart size={17} fill={active.romantic ? "#FF5D6C" : "none"} />
                    </button>
                  </>
                )}
                {active.isGroup && (
                  <button onClick={() => setShowGroupInfo(true)} title="Group info" style={iconBtn(dark)}><Info size={17} /></button>
                )}
              </div>
            </div>
            {showCall && (
              <VideoCallModal
                dark={dark}
                partnerName={active.name}
                coins={coins}
                onSpend={onSpendCoins}
                onGoEarn={() => { setShowCall(false); onGoEarn(); }}
                onClose={() => setShowCall(false)}
              />
            )}

            <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 2 }}>
              {active.messages.map((m) =>
                m.from === "system" ? (
                  <div key={m.id} style={{ textAlign: "center", fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78", margin: "6px 0" }}>{m.text}</div>
                ) : (
                  <div key={m.id} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                    {active.isGroup && m.from !== "me" && (
                      <div style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 2, marginLeft: 4 }}>{m.senderName || "Member"}</div>
                    )}
                    <div style={{ background: bubbleBg(m.from === "me"), color: m.from === "me" && !active.romantic ? "white" : "inherit", padding: "9px 13px", borderRadius: 14, fontSize: 14, lineHeight: 1.4 }}>
                      {m.text}
                    </div>
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>

            <div style={{ padding: 14, borderTop: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, display: "flex", gap: 8, position: "relative", zIndex: 2 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Message"
                style={{ flex: 1, fontSize: 14, padding: "10px 14px", borderRadius: 20, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
              />
              <button onClick={send} style={{ background: active.romantic ? "#FF5D6C" : "#3F3DF2", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Send size={16} color="white" />
              </button>
            </div>

            {showGroupInfo && active.isGroup && (
              <div onClick={() => setShowGroupInfo(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, display: "flex", justifyContent: "flex-end" }}>
                <div onClick={(e) => e.stopPropagation()} className="linkly-slidein" style={{ width: 280, height: "100%", background: dark ? "#1B1A28" : "white", padding: 18, overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15 }}>Group info</span>
                    <button onClick={() => setShowGroupInfo(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}><X size={16} /></button>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 18 }}>
                    <GroupAvatarCluster members={active.members.filter((m) => m !== "You")} size={54} />
                    <div style={{ fontWeight: 700, marginTop: 10, fontSize: 14 }}>{active.name}</div>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 8 }}>{active.members.length} members</div>
                  {active.members.map((m) => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                      <Avatar name={m} size={28} />
                      <span style={{ fontSize: 13, flex: 1 }}>{m}</span>
                      {active.admins?.includes(m) && <Crown size={13} color="#FFB13F" title="Admin" />}
                      {isAdmin && m !== "You" && (
                        <button onClick={() => removeMember(m)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78" }}><UserMinus size={14} /></button>
                      )}
                    </div>
                  ))}
                  {isAdmin && addableCandidates.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 6 }}>Add people</div>
                      {addableCandidates.map((c) => (
                        <button key={c} onClick={() => addMember(c)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 0", color: "inherit" }}>
                          <UserPlus size={14} color="#3F3DF2" /> <span style={{ fontSize: 13 }}>{c}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={leaveOrDelete} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginTop: 18, background: "none", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 8, padding: "9px 12px", cursor: "pointer", color: "#FF5D6C", fontSize: 13, fontWeight: 600 }}>
                    <LogOut size={14} /> {isAdmin ? "Delete group" : "Leave group"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ margin: "auto", color: dark ? "#7A7869" : "#8C8A78", fontSize: 14 }}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}

function stageFromCount(count) {
  let s = 0;
  for (let i = 0; i < REVEAL_THRESHOLDS.length; i++) if (count >= REVEAL_THRESHOLDS[i]) s = i + 1;
  return s;
}

function partnerLabel(fullName, stage) {
  const [first, last] = fullName.split(" ");
  if (stage <= 0) return "Stranger";
  if (stage === 1) return `${first[0]}. ${last[0]}.`;
  if (stage === 2) return first;
  if (stage === 3) return `${first} ${last[0]}.`;
  return fullName;
}

function StrangerAvatar({ name, stage, size = 32, dark }) {
  if (stage <= 0) {
    return (
      <div style={{ width: size, height: size, borderRadius: 10, background: dark ? "#242331" : "#E7E5DE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <EyeOff size={size * 0.42} color={dark ? "#9C9A90" : "#6B6A5A"} />
      </div>
    );
  }
  const blur = stage === 1 ? 6 : stage === 2 ? 3 : stage === 3 ? 1.2 : 0;
  const displayName = stage === 1 ? name.split(" ")[0][0] : name;
  return (
    <div style={{ filter: blur ? `blur(${blur}px)` : "none", transition: "filter 0.4s ease" }}>
      <Avatar name={displayName} size={size} tone="ping" />
    </div>
  );
}

function StrangerChat({ dark }) {
  const [session, setSession] = useState(null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState("");
  const bottomRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2200); };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages.length, typing]);

  const startChat = () => {
    setConnecting(true);
    setTimeout(() => {
      const partnerName = STRANGER_NAMES[Math.floor(Math.random() * STRANGER_NAMES.length)];
      setSession({ partnerName, messages: [], myManualStage: 0, theirManualStage: 0 });
      setConnecting(false);
    }, 900);
  };

  const endChat = (reason) => {
    setSession(null);
    setDraft("");
    setTyping(false);
    if (reason) showToast(reason);
  };

  const revealMore = () => {
    setSession((s) => {
      if (!s) return s;
      const floor = stageFromCount(s.messages.length);
      const current = Math.max(floor, s.myManualStage);
      const next = Math.min(4, current + 1);
      showToast(`You revealed: ${REVEAL_STAGE_LABELS[next]}`);
      return { ...s, myManualStage: next };
    });
    setTimeout(() => {
      setSession((s) => {
        if (!s) return s;
        const floor = stageFromCount(s.messages.length);
        const current = Math.max(floor, s.theirManualStage);
        const next = Math.min(4, current + 1);
        showToast(`${s.partnerName.split(" ")[0]} revealed more too`);
        return { ...s, theirManualStage: next };
      });
    }, 1200 + Math.random() * 900);
  };

  const send = () => {
    if (!draft.trim() || !session) return;
    const text = draft.trim();
    setDraft("");
    setSession((s) => ({ ...s, messages: [...s.messages, { id: "sm" + Date.now(), from: "me", text }] }));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setSession((s) => {
        if (!s) return s;
        const reply = STRANGER_REPLIES[Math.floor(Math.random() * STRANGER_REPLIES.length)];
        const nextMessages = [...s.messages, { id: "sm" + Date.now(), from: "them", text: reply }];
        const prevStage = stageFromCount(s.messages.length);
        const newStage = stageFromCount(nextMessages.length);
        if (newStage > prevStage) showToast(`${nextMessages.length} messages in — now showing: ${REVEAL_STAGE_LABELS[newStage]}`);
        return { ...s, messages: nextMessages };
      });
    }, 700 + Math.random() * 900);
  };

  if (!session) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#3F3DF2,#FF5D6C)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Shuffle size={24} color="white" />
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Stranger Chat</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: dark ? "#9C9A90" : "#6B6A5A", marginBottom: 24 }}>
          You'll be matched with someone at random. Nobody's identified at first — as you keep
          talking, small pieces reveal on their own (initials, then a first name), and you can
          also choose to reveal a bit more about yourself at any time. Nothing reveals all at once.
        </div>
        <button
          onClick={startChat}
          disabled={connecting}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3F3DF2", color: "white", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          {connecting ? <><Loader2 size={15} className="linkly-spin" /> Finding someone…</> : <>Start a chat</>}
        </button>
      </div>
    );
  }

  const count = session.messages.length;
  const floorStage = stageFromCount(count);
  const theirStage = Math.max(floorStage, session.theirManualStage);
  const myStage = Math.max(floorStage, session.myManualStage);
  const nextThreshold = REVEAL_THRESHOLDS[floorStage];
  const fullyRevealed = theirStage >= 4 && myStage >= 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: 640, margin: "0 auto", position: "relative" }}>
      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 8, right: 16, background: "#14131F", color: "white", fontSize: 12, fontWeight: 600, padding: "7px 13px", borderRadius: 8, zIndex: 10, maxWidth: 260 }}>
          {toast}
        </div>
      )}

      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${dark ? "#242331" : "#E7E5DE"}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StrangerAvatar name={session.partnerName} stage={theirStage} dark={dark} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{partnerLabel(session.partnerName, theirStage)}</div>
              <div style={{ fontSize: 11, color: theirStage >= 4 ? "#2ECC71" : (dark ? "#7A7869" : "#8C8A78") }}>
                {REVEAL_STAGE_LABELS[theirStage]}{theirStage < 4 ? " so far" : ""}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {myStage < 4 && (
              <button
                onClick={revealMore}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "#3F3DF2", color: "white", border: "none", borderRadius: 7, padding: "6px 11px", cursor: "pointer" }}
              >
                <User size={12} /> Reveal a bit more
              </button>
            )}
            <button onClick={() => endChat("Chat ended — Skip")} title="New stranger" style={iconBtn(dark)}><Shuffle size={16} /></button>
            <button onClick={() => endChat("Reported — thanks, we'll review it")} title="Report" style={iconBtn(dark)}><Flag size={16} /></button>
            <button onClick={() => endChat("You left the chat")} title="End chat" style={iconBtn(dark)}><X size={16} /></button>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, display: "flex", gap: 3 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < floorStage ? "#3F3DF2" : (dark ? "#242331" : "#EFEEE6"), transition: "background 0.3s ease" }} />
            ))}
          </div>
          <span style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78", flexShrink: 0 }}>
            {fullyRevealed ? "Fully revealed" : nextThreshold ? `${count}/${nextThreshold} to next reveal` : "Max auto-reveal reached"}
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78", marginTop: 4 }}>
          You're showing: {REVEAL_STAGE_LABELS[myStage]}{myStage < 4 ? " so far" : ""}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ textAlign: "center", fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 6 }}>
          You're connected with a stranger. Identities reveal gradually — be kind, and end the chat any time.
        </div>
        {session.messages.map((m) => (
          <div
            key={m.id}
            className="linkly-slidein"
            style={{
              alignSelf: m.from === "me" ? "flex-end" : "flex-start",
              background: m.from === "me" ? "#3F3DF2" : dark ? "#1B1A28" : "#EFEEE6",
              color: m.from === "me" ? "white" : "inherit",
              padding: "9px 13px",
              borderRadius: 14,
              maxWidth: "70%",
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {m.text}
          </div>
        ))}
        {typing && (
          <div style={{ alignSelf: "flex-start", fontSize: 12, color: dark ? "#7A7869" : "#8C8A78", padding: "4px 4px" }}>
            {partnerLabel(session.partnerName, theirStage)} is typing…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 14, borderTop: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, display: "flex", gap: 8 }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Say something…"
          style={{ flex: 1, fontSize: 14, padding: "10px 14px", borderRadius: 20, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
        />
        <button onClick={send} style={{ background: "#3F3DF2", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}

function CreateMenu({ dark, onPickPost, onPickReel, onPickLive, onPickGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const options = [
    { key: "post", label: "Create post", sub: "Share a text, photo or video update", Icon: Pencil, onClick: onPickPost },
    { key: "reel", label: "Upload reel or video", sub: "Post a short vertical video", Icon: Film, onClick: onPickReel },
    { key: "live", label: "Go live", sub: "Start a live stream for your followers", Icon: Radio, onClick: onPickLive },
    { key: "group", label: "New group chat", sub: "Start a conversation with a few people", Icon: Users, onClick: onPickGroup },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Create"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#3F3DF2", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer" }}
      >
        <Plus size={16} color="white" />
      </button>
      {open && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 38, right: 0, width: 240, background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 12, padding: 6, zIndex: 40, boxShadow: "0 8px 24px rgba(0,0,0,0.16)" }}>
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => { o.onClick(); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", borderRadius: 8, padding: "9px 8px", cursor: "pointer", textAlign: "left", color: "inherit" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "#242331" : "#F2F0E8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: dark ? "#242331" : "#F2F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <o.Icon size={15} color="#3F3DF2" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{o.label}</div>
                <div style={{ fontSize: 10.5, color: dark ? "#7A7869" : "#8C8A78" }}>{o.sub}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WatchAdModal({ dark, onClose, onReward }) {
  const [secondsLeft, setSecondsLeft] = useState(6);
  const [claimed, setClaimed] = useState(false);
  const sponsor = useRef(SPONSORS[Math.floor(Math.random() * SPONSORS.length)]).current;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const claim = () => {
    setClaimed(true);
    onReward(AD_REWARD);
    setTimeout(onClose, 1400);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,10,0.88)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="linkly-slidein" style={{ width: 360, maxWidth: "100%", borderRadius: 18, overflow: "hidden", background: dark ? "#1B1A28" : "white", color: "inherit" }}>
        <div className="linkly-reel-bg" style={{ height: 220, background: sponsor.gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.4)", color: "white", fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>
            Sponsored · demo ad
          </div>
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.4)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 20 }}>
            {secondsLeft > 0 ? `${secondsLeft}s` : "Ready"}
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "white", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>{sponsor.brand}</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", marginTop: 6, textAlign: "center", padding: "0 24px" }}>{sponsor.tagline}</div>
        </div>
        <div style={{ height: 3, background: dark ? "#2C2B39" : "#E7E5DE" }}>
          <div style={{ height: "100%", width: `${((6 - secondsLeft) / 6) * 100}%`, background: "#3F3DF2", transition: "width 1s linear" }} />
        </div>
        <div style={{ padding: 20, textAlign: "center" }}>
          {claimed ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#2ECC71", fontWeight: 700, fontSize: 15 }}>
              <Coins size={18} /> +{AD_REWARD} coins added
            </div>
          ) : secondsLeft > 0 ? (
            <>
              <div style={{ fontSize: 12.5, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 12 }}>
                Watch the full ad to earn {AD_REWARD} coins — can't skip a rewarded ad early, same as real ad networks.
              </div>
              <button disabled style={{ background: dark ? "#2C2B39" : "#E7E5DE", color: dark ? "#6B6A5A" : "#A8A694", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, width: "100%" }}>
                Please wait…
              </button>
            </>
          ) : (
            <button onClick={claim} style={{ background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, width: "100%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Coins size={15} /> Claim {AD_REWARD} coins
            </button>
          )}
          {!claimed && (
            <button onClick={onClose} style={{ marginTop: 10, background: "none", border: "none", color: dark ? "#7A7869" : "#8C8A78", fontSize: 12, cursor: "pointer" }}>
              {secondsLeft > 0 ? "Cancel — no reward" : "Close without claiming"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EarnPage({ dark, coins, coinLog, onWatchAd, onDailyBonus, dailyClaimed, onRedeem, redeemedIds, adFreeActive }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 60px" }}>
      <div style={{ background: "linear-gradient(135deg,#3F3DF2,#FF5D6C)", borderRadius: 18, padding: "28px 24px", color: "white", marginBottom: 20 }}>
        <div style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 6 }}>Your balance</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 34 }}>
          <Coins size={30} /> {coins.toLocaleString()}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        <button
          onClick={onWatchAd}
          style={{ background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer", color: "inherit" }}
        >
          <PlayCircle size={20} color="#3F3DF2" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 3 }}>Watch an ad</div>
          <div style={{ fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78" }}>Earn {AD_REWARD} coins per ad</div>
        </button>
        <button
          onClick={onDailyBonus}
          disabled={dailyClaimed}
          style={{ background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 14, padding: 18, textAlign: "left", cursor: dailyClaimed ? "default" : "pointer", color: "inherit", opacity: dailyClaimed ? 0.55 : 1 }}
        >
          <Gift size={20} color="#FF5D6C" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 3 }}>{dailyClaimed ? "Claimed today" : "Daily check-in"}</div>
          <div style={{ fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78" }}>{dailyClaimed ? "Come back tomorrow" : "Earn 10 coins, free"}</div>
        </button>
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 10 }}>Redeem coins</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {REDEEM_CATALOG.map((item) => {
          const isPermanent = item.id === "supporter" || item.id === "frame";
          const owned = isPermanent && redeemedIds.includes(item.id);
          const isActiveConsumable = item.id === "adfree" && adFreeActive;
          const locked = owned || isActiveConsumable;
          const affordable = coins >= item.cost;
          return (
            <div key={item.id} style={{ background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 14, padding: 16 }}>
              <item.Icon size={19} color="#FFB13F" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 10, lineHeight: 1.4 }}>{item.desc}</div>
              <button
                onClick={() => onRedeem(item)}
                disabled={locked || !affordable}
                style={{
                  width: "100%", border: "none", borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: locked || !affordable ? "default" : "pointer",
                  background: locked ? "#2ECC7122" : affordable ? "#3F3DF2" : (dark ? "#2C2B39" : "#E7E5DE"),
                  color: locked ? "#2ECC71" : affordable ? "white" : (dark ? "#6B6A5A" : "#A8A694"),
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}
              >
                {owned ? <><Check size={12} /> Owned</> : isActiveConsumable ? <><Check size={12} /> Active</> : <><Coins size={12} /> {item.cost}</>}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 10 }}>Activity</div>
      {coinLog.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", fontSize: 13, color: dark ? "#7A7869" : "#8C8A78" }}>No activity yet — watch an ad to get started.</div>
      ) : (
        coinLog.map((l) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${dark ? "#242331" : "#EFEEE6"}`, fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkle size={13} color={l.amount < 0 ? "#FF5D6C" : "#3F3DF2"} /> {l.reason}
            </div>
            <span style={{ fontWeight: 700, color: l.amount < 0 ? "#FF5D6C" : "#2ECC71" }}>{l.amount > 0 ? "+" : ""}{l.amount}</span>
          </div>
        ))
      )}

      <div style={{ marginTop: 24, fontSize: 11, color: dark ? "#7A7869" : "#8C8A78", lineHeight: 1.6 }}>
        Coins redeem for perks inside Linkly only — there's no cash-out. Demo ad content shown here is placeholder, not a real ad network.
      </div>
    </div>
  );
}

function VideoCallModal({ dark, partnerName, coins, onSpend, onGoEarn, onClose }) {
  const [phase, setPhase] = useState(coins >= CALL_PERIOD_COST ? "calling" : "insufficient");
  const [duration, setDuration] = useState(0);
  const [spent, setSpent] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [endReason, setEndReason] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const coinsRef = useRef(coins);
  const startedRef = useRef(false);

  useEffect(() => { coinsRef.current = coins; }, [coins]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(false);
    } catch {
      setCameraError(true);
    }
  };

  useEffect(() => {
    if (phase !== "calling" || startedRef.current) return;
    startedRef.current = true;
    onSpend(CALL_PERIOD_COST, `Video call with ${partnerName} — first ${CALL_PERIOD_MINUTES} min`);
    setSpent(CALL_PERIOD_COST);
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [phase]);

  useEffect(() => {
    if (phase !== "calling") return;
    const durTimer = setInterval(() => setDuration((d) => d + 1), 1000);
    const billTimer = setInterval(() => {
      if (coinsRef.current < CALL_PERIOD_COST) {
        endCall("Call ended — out of coins");
      } else {
        onSpend(CALL_PERIOD_COST, `Video call — next ${CALL_PERIOD_MINUTES} min`);
        setSpent((s) => s + CALL_PERIOD_COST);
      }
    }, CALL_PERIOD_MS);
    return () => { clearInterval(durTimer); clearInterval(billTimer); };
  }, [phase]);

  const endCall = (reason) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setEndReason(reason || "Call ended");
    setPhase("ended");
  };

  const toggleCam = () => {
    setCamOn((c) => {
      streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !c));
      return !c;
    });
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "insufficient") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,10,0.85)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="linkly-slidein" style={{ width: 320, borderRadius: 16, background: dark ? "#1B1A28" : "white", color: "inherit", padding: 22, textAlign: "center" }}>
          <Coins size={26} color="#FFB13F" style={{ marginBottom: 10 }} />
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Not enough coins</div>
          <div style={{ fontSize: 12.5, color: dark ? "#9C9A90" : "#6B6A5A", marginBottom: 18, lineHeight: 1.5 }}>
            A video call costs {CALL_PERIOD_COST} coins per {CALL_PERIOD_MINUTES} minutes connected. You have {coins}.
          </div>
          <button onClick={onGoEarn} style={{ width: "100%", background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>
            Earn more coins
          </button>
          <button onClick={onClose} style={{ width: "100%", background: "none", border: "none", color: dark ? "#7A7869" : "#8C8A78", fontSize: 12.5, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,10,0.85)", zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="linkly-slidein" style={{ width: 320, borderRadius: 16, background: dark ? "#1B1A28" : "white", color: "inherit", padding: 22, textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{endReason}</div>
          <div style={{ fontSize: 12.5, color: dark ? "#9C9A90" : "#6B6A5A", marginBottom: 18 }}>
            {fmt(duration)} · {spent} coins spent
          </div>
          <button onClick={onClose} style={{ width: "100%", background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0B0A10", zIndex: 80, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar name={partnerName} size={84} />
          <div style={{ color: "white", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, marginTop: 12 }}>{partnerName}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>{fmt(duration)}</div>
        </div>

        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.4)", color: "white", fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 20 }}>
          <Coins size={12} color="#FFB13F" /> {coins} · -{spent} this call
        </div>

        <div style={{ position: "absolute", bottom: 16, right: 16, width: 110, height: 150, borderRadius: 12, overflow: "hidden", border: "2px solid rgba(255,255,255,0.25)", background: "#1B1A28" }}>
          {!cameraError && camOn ? (
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cameraError ? <Camera size={20} color="rgba(255,255,255,0.35)" /> : <VideoOff size={20} color="rgba(255,255,255,0.35)" />}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, padding: 22 }}>
        <button onClick={() => setMicOn((m) => !m)} style={{ width: 46, height: 46, borderRadius: "50%", background: micOn ? "rgba(255,255,255,0.15)" : "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {micOn ? <Mic size={18} color="white" /> : <MicOff size={18} color="#14131F" />}
        </button>
        <button onClick={() => endCall("Call ended")} style={{ width: 54, height: 54, borderRadius: "50%", background: "#FF5D6C", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <PhoneOff size={20} color="white" />
        </button>
        <button onClick={toggleCam} style={{ width: 46, height: 46, borderRadius: "50%", background: camOn ? "rgba(255,255,255,0.15)" : "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {camOn ? <Video size={18} color="white" /> : <VideoOff size={18} color="#14131F" />}
        </button>
      </div>
    </div>
  );
}

function LiveStream({ dark, name, onEnd }) {
  const [phase, setPhase] = useState("setup"); // setup | live | ended
  const [cameraError, setCameraError] = useState(false);
  const [viewers, setViewers] = useState(1);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");
  const [hearts, setHearts] = useState([]);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  useEffect(() => {
    if (phase !== "live") return;
    const viewerTimer = setInterval(() => setViewers((v) => Math.max(1, v + (Math.random() > 0.35 ? 1 : -1) * Math.round(Math.random() * 2))), 2600);
    const commentTimer = setInterval(() => {
      const who = LIVE_VIEWER_NAMES[Math.floor(Math.random() * LIVE_VIEWER_NAMES.length)];
      const text = LIVE_COMMENTS[Math.floor(Math.random() * LIVE_COMMENTS.length)];
      setComments((c) => [...c.slice(-40), { id: "lc" + Date.now() + Math.random(), name: who, text }]);
    }, 2200 + Math.random() * 1800);
    const durationTimer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => { clearInterval(viewerTimer); clearInterval(commentTimer); clearInterval(durationTimer); };
  }, [phase]);

  const startLive = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(false);
    } catch (err) {
      setCameraError(true);
    }
    setPhase("live");
    setComments([{ id: "lc0", name: "Linkly", text: `${name.split(" ")[0]} started a live stream` }]);
  };

  const endLive = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("ended");
  };

  const sendComment = () => {
    if (!draft.trim()) return;
    setComments((c) => [...c, { id: "lc" + Date.now(), name: "You", text: draft.trim() }]);
    setDraft("");
  };

  const burstHeart = () => {
    const id = "h" + Date.now() + Math.random();
    setHearts((h) => [...h, { id, left: 70 + Math.random() * 20 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 2200);
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "setup") {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#FF5D6C,#3F3DF2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <Radio size={24} color="white" />
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Go live</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: dark ? "#9C9A90" : "#6B6A5A", marginBottom: 24 }}>
          Starts a live broadcast your followers can join and comment on. If camera access isn't
          available in this preview, you'll get a demo stream instead — everything else still works.
        </div>
        <button
          onClick={startLive}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#FF5D6C", color: "white", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          <Camera size={16} /> Start streaming
        </button>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Stream ended</div>
        <div style={{ fontSize: 13.5, color: dark ? "#9C9A90" : "#6B6A5A", marginBottom: 20 }}>
          You were live for {fmt(duration)} with a peak of {viewers} viewers and {comments.length} comments.
        </div>
        <button onClick={onEnd} style={{ background: "#3F3DF2", color: "white", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1, position: "relative", background: "#0B0A10", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {!cameraError ? (
          <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
        ) : (
          <div className="linkly-reel-bg" style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#3F3DF2,#FF5D6C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={40} color="rgba(255,255,255,0.4)" />
          </div>
        )}

        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#FF5D6C", color: "white", fontSize: 11.5, fontWeight: 700, padding: "4px 9px", borderRadius: 6 }}>
            <span className="linkly-live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} /> LIVE
          </span>
          <span style={{ background: "rgba(0,0,0,0.4)", color: "white", fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 6 }}>{fmt(duration)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.4)", color: "white", fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 6 }}>
            <Users size={11} /> {viewers}
          </span>
        </div>

        {cameraError && (
          <div style={{ position: "absolute", top: 54, left: 16, right: 16, background: "rgba(0,0,0,0.45)", color: "white", fontSize: 11, padding: "6px 10px", borderRadius: 8 }}>
            Camera unavailable in this preview — showing a demo stream.
          </div>
        )}

        <button onClick={endLive} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: 8, padding: "6px 12px", color: "white", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          End stream
        </button>

        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {hearts.map((h) => (
            <span key={h.id} className="linkly-float-heart" style={{ left: `${h.left}%`, fontSize: 22 }}>💗</span>
          ))}
        </div>

        <button onClick={burstHeart} title="Send love" style={{ position: "absolute", bottom: 18, right: 18, background: "rgba(255,255,255,0.16)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={18} color="white" />
        </button>
      </div>

      <div style={{ width: 260, borderLeft: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, fontSize: 12.5, fontWeight: 600 }}>Live chat</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {comments.map((c) => (
            <div key={c.id} className="linkly-slidein" style={{ fontSize: 12.5 }}>
              <span style={{ fontWeight: 700, color: "#3F3DF2" }}>{c.name}</span>{" "}
              <span style={{ color: dark ? "#D8D6CC" : "#33321F" }}>{c.text}</span>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>
        <div style={{ padding: 12, borderTop: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, display: "flex", gap: 6 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendComment()}
            placeholder="Say something…"
            style={{ flex: 1, fontSize: 12.5, padding: "8px 10px", borderRadius: 8, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
          />
          <button onClick={sendComment} style={{ background: "#3F3DF2", border: "none", borderRadius: 8, padding: "0 10px", cursor: "pointer" }}>
            <Send size={13} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Reels({ dark }) {
  const [reels, setReels] = useState(seedReels);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [commentsOpenId, setCommentsOpenId] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [toast, setToast] = useState("");
  const [poppedId, setPoppedId] = useState(null);
  const fileRef = useRef(null);
  const lastWheel = useRef(0);
  const objectUrls = useRef([]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1800); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") next();
      if (e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => () => { objectUrls.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  const next = () => setIndex((i) => Math.min(reels.length - 1, i + 1));
  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const onWheel = (e) => {
    const now = Date.now();
    if (now - lastWheel.current < 500) return;
    lastWheel.current = now;
    if (e.deltaY > 20) next();
    else if (e.deltaY < -20) prev();
  };

  const pickVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    const newReel = { id: "rl" + Date.now(), name: "You", handle: "@you", caption: "my reel", gradient: "linear-gradient(160deg,#3F3DF2,#FF5D6C)", videoUrl: url, likes: 0, liked: false, saved: false, following: false, comments: [], isOwn: true };
    setReels((rs) => [newReel, ...rs]);
    setIndex(0);
    showToast("Reel uploaded");
    e.target.value = "";
  };

  const toggleLike = (id) => {
    setReels((rs) => rs.map((r) => (r.id === id ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r)));
    setPoppedId(id);
    setTimeout(() => setPoppedId(null), 320);
  };
  const toggleSave = (id) => {
    setReels((rs) => rs.map((r) => (r.id === id ? { ...r, saved: !r.saved } : r)));
    showToast("Saved");
  };
  const toggleFollow = (id) => setReels((rs) => rs.map((r) => (r.id === id ? { ...r, following: !r.following } : r)));
  const share = () => showToast("Link copied");
  const addComment = (id) => {
    if (!commentDraft.trim()) return;
    setReels((rs) => rs.map((r) => (r.id === id ? { ...r, comments: [...r.comments, { id: "rc" + Date.now(), name: "You", text: commentDraft.trim() }] } : r)));
    setCommentDraft("");
  };
  const deleteReel = (id) => {
    setReels((rs) => rs.filter((r) => r.id !== id));
    setIndex((i) => Math.max(0, Math.min(i, reels.length - 2)));
    showToast("Reel deleted");
  };

  const r = reels[index];
  if (!r) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <Film size={28} color={dark ? "#7A7869" : "#8C8A78"} />
        <span style={{ fontSize: 13.5, color: dark ? "#7A7869" : "#8C8A78" }}>No reels yet</span>
        <button onClick={() => fileRef.current?.click()} style={{ background: "#3F3DF2", color: "white", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Upload a reel</button>
        <input ref={fileRef} type="file" accept="video/*" onChange={pickVideo} style={{ display: "none" }} />
      </div>
    );
  }

  return (
    <div
      onWheel={onWheel}
      style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: dark ? "#0B0A10" : "#14131F", position: "relative", overflow: "hidden" }}
    >
      <input ref={fileRef} type="file" accept="video/*" onChange={pickVideo} style={{ display: "none" }} />

      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(20,19,31,0.9)", color: "white", fontSize: 12.5, fontWeight: 600, padding: "7px 14px", borderRadius: 8, zIndex: 20 }}>
          {toast}
        </div>
      )}

      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", gap: 4, zIndex: 15 }}>
        {reels.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= index ? "white" : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>

      <button onClick={() => fileRef.current?.click()} title="Upload a reel" style={{ position: "absolute", top: 30, right: 14, zIndex: 15, background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <UploadIcon size={15} color="white" />
      </button>
      <button onClick={() => setMuted((m) => !m)} title="Mute" style={{ position: "absolute", top: 30, right: 54, zIndex: 15, background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        {muted ? <VolumeX size={15} color="white" /> : <Volume2 size={15} color="white" />}
      </button>

      <div style={{ width: "min(360px, 100%)", height: "100%", position: "relative" }}>
        {r.videoUrl ? (
          <video
            key={r.id}
            src={r.videoUrl}
            autoPlay
            loop
            muted={muted}
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="linkly-reel-bg" style={{ width: "100%", height: "100%", background: r.gradient, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Film size={40} color="rgba(255,255,255,0.4)" />
            <span style={{ position: "absolute", bottom: 100, left: 18, right: 90, color: "rgba(255,255,255,0.55)", fontSize: 11 }}>
              Demo reel — no real video in this preview. Upload your own to see real playback.
            </span>
          </div>
        )}

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 70px 20px 16px", background: "linear-gradient(transparent, rgba(0,0,0,0.55))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Avatar name={r.name} size={30} />
            <span style={{ color: "white", fontSize: 13.5, fontWeight: 600 }}>{r.handle}</span>
            {!r.isOwn && (
              <button
                onClick={() => toggleFollow(r.id)}
                style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, cursor: "pointer", border: r.following ? "1px solid rgba(255,255,255,0.5)" : "none", background: r.following ? "transparent" : "white", color: r.following ? "white" : "#14131F" }}
              >
                {r.following ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div style={{ color: "white", fontSize: 13, lineHeight: 1.4 }}>{r.caption}</div>
        </div>

        <div style={{ position: "absolute", bottom: 24, right: -50, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <button onClick={() => toggleLike(r.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <Heart size={24} className={poppedId === r.id ? "linkly-pop" : ""} fill={r.liked ? "#FF5D6C" : "none"} color={r.liked ? "#FF5D6C" : "white"} />
            <span style={{ color: "white", fontSize: 10.5 }}>{r.likes}</span>
          </button>
          <button onClick={() => setCommentsOpenId(r.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <MessageSquare size={22} color="white" />
            <span style={{ color: "white", fontSize: 10.5 }}>{r.comments.length}</span>
          </button>
          <button onClick={share} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Share2 size={22} color="white" />
          </button>
          <button onClick={() => toggleSave(r.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <Bookmark size={22} fill={r.saved ? "white" : "none"} color="white" />
          </button>
          {r.isOwn && (
            <button onClick={() => deleteReel(r.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Trash2 size={20} color="white" />
            </button>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 15 }}>
        <button onClick={prev} disabled={index === 0} style={{ background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}>
          <ChevronUp size={16} color="white" />
        </button>
        <button onClick={next} disabled={index === reels.length - 1} style={{ background: "rgba(255,255,255,0.14)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: index === reels.length - 1 ? "default" : "pointer", opacity: index === reels.length - 1 ? 0.4 : 1 }}>
          <ChevronDown size={16} color="white" />
        </button>
      </div>

      {commentsOpenId && (
        <div onClick={() => setCommentsOpenId(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 25, display: "flex", alignItems: "flex-end" }}>
          <div onClick={(e) => e.stopPropagation()} className="linkly-slidein" style={{ width: "100%", maxHeight: "60%", background: dark ? "#1B1A28" : "white", borderRadius: "16px 16px 0 0", padding: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: dark ? "#F2F1EC" : "#14131F" }}>Comments</span>
              <button onClick={() => setCommentsOpenId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#F2F1EC" : "#14131F" }}><X size={16} /></button>
            </div>
            <div style={{ overflowY: "auto", flex: 1, marginBottom: 10 }}>
              {reels.find((x) => x.id === commentsOpenId)?.comments.length === 0 && (
                <div style={{ fontSize: 12.5, color: dark ? "#7A7869" : "#8C8A78", textAlign: "center", padding: "16px 0" }}>No comments yet</div>
              )}
              {reels.find((x) => x.id === commentsOpenId)?.comments.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 13, color: dark ? "#F2F1EC" : "#14131F" }}>
                  <Avatar name={c.name} size={24} />
                  <div><span style={{ fontWeight: 600 }}>{c.name}</span>{" "}<span style={{ color: dark ? "#B8B6AD" : "#4A4938" }}>{c.text}</span></div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment(commentsOpenId)}
                placeholder="Add a comment"
                style={{ flex: 1, fontSize: 13, padding: "8px 12px", borderRadius: 8, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: dark ? "#F2F1EC" : "#14131F", outline: "none" }}
              />
              <button onClick={() => addComment(commentsOpenId)} style={{ background: "#3F3DF2", border: "none", borderRadius: 8, padding: "0 12px", cursor: "pointer" }}>
                <Send size={14} color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePage({ dark, name, bio, setName, setBio, posts, setPosts, onOpenChat, onOpenAnon, avatarUrl, setAvatarUrl, coverUrl, setCoverUrl, isSupporter, hasFrame }) {
  const [tab, setTab] = useState("posts");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [toast, setToast] = useState("");
  const [details, setDetails] = useState([
    { id: "d1", text: "Joined Linkly this year" },
    { id: "d2", text: "Profile visibility follows your privacy settings" },
  ]);
  const [newDetail, setNewDetail] = useState("");
  const avatarFileRef = useRef(null);
  const coverFileRef = useRef(null);
  const photoFileRef = useRef(null);

  const myPosts = posts.filter((p) => p.isOwn);
  const myPhotos = posts.filter((p) => p.isOwn && p.image);
  const tabs = [["posts", "Posts", myPosts.length], ["photos", "Photos", myPhotos.length], ["about", "About", null]];

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1800); };

  const readAsDataUrl = (file, cb) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const publish = ({ text, image, privacy, feeling }) => {
    setPosts((ps) => [
      { id: "p" + Date.now(), name: "You", handle: "@you", time: "now", content: text, image, privacy, feeling, likes: 0, liked: false, comments: [], commentDraft: "", showComments: false, isOwn: true },
      ...ps,
    ]);
    setShowCreate(false);
    showToast("Posted!");
  };

  const startEdit = (p) => { setEditingId(p.id); setEditDraft(p.content); };
  const saveEdit = (id) => {
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, content: editDraft.trim() } : p)));
    setEditingId(null);
    showToast("Post updated");
  };
  const deletePost = (id) => {
    setPosts((ps) => ps.filter((p) => p.id !== id));
    showToast("Deleted");
  };

  const addPhoto = (e) => {
    const file = e.target.files?.[0];
    readAsDataUrl(file, (dataUrl) => {
      setPosts((ps) => [{ id: "p" + Date.now(), name: "You", handle: "@you", time: "now", content: "", image: dataUrl, likes: 0, liked: false, comments: [], commentDraft: "", showComments: false, isOwn: true }, ...ps]);
      showToast("Photo added");
    });
    e.target.value = "";
  };

  const addDetail = () => {
    if (!newDetail.trim()) return;
    setDetails((d) => [...d, { id: "det" + Date.now(), text: newDetail.trim() }]);
    setNewDetail("");
  };
  const deleteDetail = (id) => setDetails((d) => d.filter((x) => x.id !== id));

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 60px", position: "relative" }}>
      {toast && (
        <div className="linkly-slidein" style={{ position: "absolute", top: 6, right: 20, background: "#14131F", color: "white", fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 8, zIndex: 10 }}>
          {toast}
        </div>
      )}
      {showCreate && <CreatePostModal dark={dark} onClose={() => setShowCreate(false)} onPublish={publish} />}

      <input ref={avatarFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => readAsDataUrl(e.target.files?.[0], (u) => { setAvatarUrl(u); showToast("Profile photo updated"); e.target.value = ""; })} />
      <input ref={coverFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => readAsDataUrl(e.target.files?.[0], (u) => { setCoverUrl(u); showToast("Cover photo updated"); e.target.value = ""; })} />
      <input ref={photoFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={addPhoto} />

      <div style={{ position: "relative", height: 120, borderRadius: 12, marginBottom: -40, overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", background: coverUrl ? `url(${coverUrl}) center/cover` : "linear-gradient(135deg, #3F3DF2, #FF5D6C)" }} />
        <button onClick={() => coverFileRef.current?.click()} style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.45)", color: "white", border: "none", borderRadius: 7, padding: "6px 10px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
          <Camera size={12} /> Change cover
        </button>
      </div>
      <div style={{ padding: "0 6px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <button onClick={() => avatarFileRef.current?.click()} style={{ position: "relative", border: `4px solid ${dark ? "#14131F" : "#FAFAF7"}`, borderRadius: 14, width: 76, display: "inline-block", padding: 0, cursor: "pointer", background: "none" }}>
            <div style={hasFrame ? { borderRadius: 14, padding: 3, background: "linear-gradient(135deg,#FFB13F,#FF5D6C,#3F3DF2)" } : undefined}>
              <Avatar name={name || "You"} size={68} src={avatarUrl} />
            </div>
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#3F3DF2", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${dark ? "#14131F" : "#FAFAF7"}` }}>
              <Camera size={11} color="white" />
            </div>
          </button>
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <button onClick={() => onOpenChat(name)} style={{ display: "flex", alignItems: "center", gap: 6, background: dark ? "#242331" : "#F2F0E8", color: "inherit", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              <MessageCircle size={13} /> Message
            </button>
            <button onClick={onOpenAnon} style={{ display: "flex", alignItems: "center", gap: 6, background: "#FF5D6C", color: "white", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              <EyeOff size={13} /> Anon link
            </button>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, background: "transparent", border: "none", outline: "none", color: "inherit", flex: 1, minWidth: 0 }}
            />
            {isSupporter && (
              <span title="Supporter" style={{ display: "flex", alignItems: "center", gap: 4, background: "#FFB13F22", color: "#FFB13F", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}>
                <Crown size={11} /> Supporter
              </span>
            )}
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            style={{ fontSize: 14, lineHeight: 1.5, color: dark ? "#B8B6AD" : "#4A4938", background: "transparent", border: "none", outline: "none", width: "100%", resize: "none", marginTop: 4, fontFamily: "'Inter', sans-serif" }}
          />
          <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 13, color: dark ? "#9C9A90" : "#6B6A5A" }}>
            <span><b style={{ color: "inherit" }}>128</b> followers</span>
            <span><b style={{ color: "inherit" }}>94</b> following</span>
            <span><b style={{ color: "inherit" }}>{myPosts.length}</b> posts</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, borderBottom: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}` }}>
          <div style={{ display: "flex", gap: 22 }}>
            {tabs.map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "0 0 10px",
                  fontSize: 13.5, fontWeight: 600, color: tab === key ? "#3F3DF2" : (dark ? "#7A7869" : "#8C8A78"),
                  borderBottom: tab === key ? "2px solid #3F3DF2" : "2px solid transparent",
                }}
              >
                {label}{count !== null ? ` (${count})` : ""}
              </button>
            ))}
          </div>
          {tab === "posts" && (
            <button onClick={() => setShowCreate(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#3F3DF2", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
              <Plus size={14} /> New post
            </button>
          )}
          {tab === "photos" && (
            <button onClick={() => photoFileRef.current?.click()} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#3F3DF2", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
              <UploadIcon size={13} /> Add photo
            </button>
          )}
        </div>

        <div className="linkly-slidein" style={{ paddingTop: 16 }}>
          {tab === "posts" && (
            myPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", fontSize: 13.5, color: dark ? "#7A7869" : "#8C8A78" }}>
                You haven't posted anything yet.
                <div><button onClick={() => setShowCreate(true)} style={{ marginTop: 10, background: "#3F3DF2", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Create your first post</button></div>
              </div>
            ) : myPosts.map((p) => (
              <div key={p.id} style={{ background: dark ? "#1B1A28" : "white", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 12, padding: 14, marginBottom: 10, fontSize: 13.5 }}>
                {p.image && <img src={p.image} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: p.content || editingId === p.id ? 10 : 0, maxHeight: 220, objectFit: "cover" }} />}
                {editingId === p.id ? (
                  <>
                    <textarea value={editDraft} onChange={(e) => setEditDraft(e.target.value)} rows={2} style={{ width: "100%", fontSize: 13.5, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, borderRadius: 8, padding: 8, background: "transparent", color: "inherit", outline: "none", resize: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => saveEdit(p.id)} style={{ background: "#3F3DF2", color: "white", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Save</button>
                      <button onClick={() => setEditingId(null)} style={{ background: "none", border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, color: "inherit", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {p.content && <div style={{ marginBottom: 8 }}>{p.content}</div>}
                    <div style={{ display: "flex", gap: 14 }}>
                      <button onClick={() => startEdit(p)} style={iconBtn(dark)}><Pencil size={13} /> Edit</button>
                      <button onClick={() => deletePost(p.id)} style={iconBtn(dark)}><Trash2 size={13} /> Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          {tab === "photos" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              <button onClick={() => photoFileRef.current?.click()} style={{ aspectRatio: "1", borderRadius: 8, border: `2px dashed ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78" }}>
                <Plus size={20} />
              </button>
              {myPhotos.map((p) => (
                <div key={p.id} style={{ position: "relative" }}>
                  <img src={p.image} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }} />
                  <button onClick={() => deletePost(p.id)} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={11} color="white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {tab === "about" && (
            <div style={{ fontSize: 13.5, color: dark ? "#B8B6AD" : "#4A4938" }}>
              {details.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <Info size={14} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{d.text}</span>
                  <button onClick={() => deleteDetail(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "#7A7869" : "#8C8A78" }}><X size={13} /></button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDetail()}
                  placeholder="Add a detail about yourself"
                  style={{ flex: 1, fontSize: 13, padding: "8px 10px", borderRadius: 8, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, background: "transparent", color: "inherit", outline: "none" }}
                />
                <button onClick={addDetail} style={{ background: "#3F3DF2", border: "none", borderRadius: 8, padding: "0 12px", cursor: "pointer" }}><Plus size={14} color="white" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const NOTIF_ICON = { like: Heart, comment: MessageSquare, follow: UserPlus, anon: EyeOff };
const NOTIF_COLOR = { like: "#FF5D6C", comment: "#3F3DF2", follow: "#2ECC71", anon: "#FF5D6C" };

function Notifications({ notifs, setNotifs, dark }) {
  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16 }}>Notifications</div>
        <button onClick={markAllRead} style={{ background: "none", border: "none", color: "#3F3DF2", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
          Mark all read
        </button>
      </div>
      {notifs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: dark ? "#7A7869" : "#8C8A78", fontSize: 14 }}>
          You're all caught up. Notifications will show up here.
        </div>
      )}
      {notifs.map((n) => {
        const Icon = NOTIF_ICON[n.kind];
        return (
          <div
            key={n.id}
            onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 10px",
              borderRadius: 10,
              cursor: "pointer",
              background: n.read ? "transparent" : dark ? "#1B1A28" : "#F2F0E8",
              marginBottom: 2,
            }}
          >
            <div style={{ position: "relative" }}>
              <Avatar name={n.name} size={36} />
              <div style={{ position: "absolute", bottom: -3, right: -3, width: 18, height: 18, borderRadius: "50%", background: NOTIF_COLOR[n.kind], display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${dark ? "#14131F" : "#FAFAF7"}` }}>
                <Icon size={9} color="white" />
              </div>
            </div>
            <div style={{ flex: 1, fontSize: 13.5 }}>
              <span style={{ fontWeight: 600 }}>{n.name}</span> <span style={{ color: dark ? "#B8B6AD" : "#4A4938" }}>{n.text}</span>
            </div>
            <span style={{ fontSize: 11, color: dark ? "#7A7869" : "#8C8A78", flexShrink: 0 }}>{n.time}</span>
            {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3F3DF2", flexShrink: 0 }} />}
          </div>
        );
      })}
    </div>
  );
}

function SettingsPage({ dark, setDark, notifPrefs, setNotifPrefs, privacyPrefs, setPrivacyPrefs }) {
  const Row = ({ label, sub, checked, onChange }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${dark ? "#2C2B39" : "#EFEEE6"}` }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: dark ? "#7A7869" : "#8C8A78", marginTop: 2 }}>{sub}</div>}
      </div>
      <button
        onClick={onChange}
        style={{ width: 38, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: checked ? "#3F3DF2" : dark ? "#2C2B39" : "#E7E5DE", position: "relative", flexShrink: 0 }}
      >
        <div style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.15s ease" }} />
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Settings</div>
      <div style={{ fontSize: 12.5, color: dark ? "#7A7869" : "#8C8A78", marginBottom: 18 }}>These preferences apply for this session.</div>

      <div style={{ fontSize: 12.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4, marginTop: 18 }}>Appearance</div>
      <Row label="Dark mode" sub="Switch the interface theme" checked={dark} onChange={() => setDark((d) => !d)} />

      <div style={{ fontSize: 12.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4, marginTop: 18 }}>Notifications</div>
      <Row label="Likes and comments" checked={notifPrefs.likes} onChange={() => setNotifPrefs((p) => ({ ...p, likes: !p.likes }))} />
      <Row label="New followers" checked={notifPrefs.follows} onChange={() => setNotifPrefs((p) => ({ ...p, follows: !p.follows }))} />
      <Row label="Anonymous messages" checked={notifPrefs.anon} onChange={() => setNotifPrefs((p) => ({ ...p, anon: !p.anon }))} />

      <div style={{ fontSize: 12.5, fontWeight: 600, color: dark ? "#7A7869" : "#8C8A78", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4, marginTop: 18 }}>Privacy</div>
      <Row label="Allow anonymous messages" sub="Turn off to close your anonymous inbox" checked={privacyPrefs.anonOpen} onChange={() => setPrivacyPrefs((p) => ({ ...p, anonOpen: !p.anonOpen }))} />
      <Row label="Private account" sub="Only approved followers see your posts" checked={privacyPrefs.privateAccount} onChange={() => setPrivacyPrefs((p) => ({ ...p, privateAccount: !p.privateAccount }))} />
    </div>
  );
}

export default function LinklyApp() {
  useFonts();
  const [dark, setDark] = useState(false);
  const [authView, setAuthView] = useState("landing"); // "landing" | "login" | "register" | "forgot" | "app"
  const [active, setActive] = useState("feed");
  const [posts, setPosts] = useState(() => seedPosts.map((p) => ({ ...p, saved: false, hidden: false, isOwn: false })));
  const [anonMsgs, setAnonMsgs] = useState(seedAnon);
  const [threads, setThreads] = useState(seedThreads);
  const [name, setName] = useState("You");
  const [bio, setBio] = useState("Figuring it out, one post at a time.");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [stories, setStories] = useState(seedStories);
  const [openStoryIndex, setOpenStoryIndex] = useState(null);
  const [suggested, setSuggested] = useState(seedSuggested);
  const [notifs, setNotifs] = useState(seedNotifications);
  const [collapsed, setCollapsed] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerToast, setHeaderToast] = useState("");
  const [openThreadId, setOpenThreadId] = useState(null);
  const [coins, setCoins] = useState(120);
  const [coinLog, setCoinLog] = useState([]);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [showWatchAd, setShowWatchAd] = useState(false);
  const [redeemedIds, setRedeemedIds] = useState([]);
  const [adFreeActive, setAdFreeActive] = useState(false);
  const [boostedPostId, setBoostedPostId] = useState(null);
  const [notifPrefs, setNotifPrefs] = useState({ likes: true, follows: true, anon: true });
  const [privacyPrefs, setPrivacyPrefs] = useState({ anonOpen: true, privateAccount: false });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 720);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (openStoryIndex === null) return;
    setStories((ss) => ss.map((s, idx) => (idx === openStoryIndex ? { ...s, viewed: true } : s)));
  }, [openStoryIndex]);

  const showHeaderToast = (msg) => {
    setHeaderToast(msg);
    setTimeout(() => setHeaderToast(""), 1800);
  };

  const bg = dark ? "#14131F" : "#FAFAF7";
  const fg = dark ? "#F2F1EC" : "#14131F";

  if (authView === "landing") {
    return <Landing dark={dark} onGoLogin={() => setAuthView("login")} onGoRegister={() => setAuthView("register")} />;
  }
  if (authView === "login" || authView === "register" || authView === "forgot") {
    return (
      <AuthScreen
        mode={authView}
        dark={dark}
        onSwitchMode={setAuthView}
        onBackToLanding={() => setAuthView("landing")}
        onLogin={() => setAuthView("app")}
        onRegister={(enteredName) => { if (enteredName) setName(enteredName); setAuthView("app"); }}
      />
    );
  }

  const unreadAnon = anonMsgs.filter((m) => !m.read).length;
  const unreadNotifs = notifs.filter((n) => !n.read).length;
  const unreadMsgs = threads.filter((t) => t.messages[t.messages.length - 1]?.from === "them").length > 0 ? 1 : 0;

  const openStoryHandler = (id) => setOpenStoryIndex(stories.findIndex((s) => s.id === id));
  const nextStory = () => setOpenStoryIndex((i) => (i === null || i + 1 >= stories.length ? null : i + 1));
  const prevStory = () => setOpenStoryIndex((i) => (i === null || i === 0 ? i : i - 1));
  const addStory = (dataUrl) => {
    setStories((ss) => [{ id: "s" + Date.now(), name: "You", viewed: true, gradient: "linear-gradient(135deg,#3F3DF2,#FF5D6C)", caption: "my story", image: dataUrl, own: true }, ...ss]);
    showHeaderToast("Story added");
  };
  const deleteStory = (id) => {
    setStories((ss) => ss.filter((s) => s.id !== id));
    setOpenStoryIndex(null);
    showHeaderToast("Story deleted");
  };

  const addCoins = (amount, reason) => {
    setCoins((c) => c + amount);
    setCoinLog((log) => [{ id: "cl" + Date.now(), amount, reason, time: "just now" }, ...log].slice(0, 30));
    showHeaderToast(`+${amount} coins`);
  };

  const spendCoins = (amount, reason) => {
    setCoins((c) => Math.max(0, c - amount));
    setCoinLog((log) => [{ id: "cl" + Date.now(), amount: -amount, reason, time: "just now" }, ...log].slice(0, 30));
  };

  const claimDailyBonus = () => {
    if (dailyClaimed) return;
    setDailyClaimed(true);
    addCoins(10, "Daily check-in");
  };

  const redeemItem = (item) => {
    if (coins < item.cost) { showHeaderToast("Not enough coins"); return; }
    if ((item.id === "supporter" || item.id === "frame") && redeemedIds.includes(item.id)) return;

    if (item.id === "boost") {
      const mine = posts.filter((p) => p.isOwn);
      if (mine.length === 0) { showHeaderToast("Post something first, then boost it"); return; }
      setBoostedPostId(mine[0].id);
    }
    if (item.id === "adfree") setAdFreeActive(true);
    if (item.id === "frame" || item.id === "supporter") setRedeemedIds((ids) => [...ids, item.id]);

    setCoins((c) => c - item.cost);
    setCoinLog((log) => [{ id: "cl" + Date.now(), amount: -item.cost, reason: `Redeemed: ${item.label}`, time: "just now" }, ...log].slice(0, 30));
    showHeaderToast(`Redeemed: ${item.label}`);
  };

  const openChatWith = (personName) => {
    setActive("messages");
    setThreads((ts) => {
      const existing = ts.find((t) => t.name === personName && !t.isGroup);
      if (existing) { setOpenThreadId(existing.id); return ts; }
      const id = "t" + Date.now();
      setOpenThreadId(id);
      return [...ts, { id, name: personName, online: true, isGroup: false, romantic: false, messages: [] }];
    });
  };

  const showRightPanel = (active === "feed" || active === "explore") && !isMobile;
  const people = [...seedSuggested, ...seedOnline, { id: "self", name }];

  return (
    <div style={{ background: bg, color: fg, height: "min(780px, 92vh)", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif", borderRadius: 16, overflow: "hidden", border: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, transition: "background 0.2s ease, color 0.2s ease" }}>
      <GlobalStyle />
      {showWatchAd && <WatchAdModal dark={dark} onClose={() => setShowWatchAd(false)} onReward={(amt) => addCoins(amt, "Watched an ad")} />}
      <StoryViewer stories={stories} index={openStoryIndex} onClose={() => setOpenStoryIndex(null)} onNext={nextStory} onPrev={prevStory} onDelete={deleteStory} />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {!isMobile && (
          <NavRail active={active} setActive={setActive} dark={dark} collapsed={collapsed} setCollapsed={setCollapsed} unreadAnon={unreadAnon} unreadMsgs={unreadMsgs} unreadNotifs={unreadNotifs} name={name} avatarUrl={avatarUrl} />
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderBottom: `1px solid ${dark ? "#242331" : "#E7E5DE"}`, gap: 14 }}>
            {isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#3F3DF2" }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16 }}>linkly</span>
              </div>
            )}
            {!isMobile && <SearchBar dark={dark} posts={posts} people={people} onNavigate={setActive} />}
            {headerToast && (
              <div className="linkly-slidein" style={{ position: "absolute", top: 48, right: 20, background: "#14131F", color: "white", fontSize: 12, fontWeight: 600, padding: "7px 13px", borderRadius: 8, zIndex: 25 }}>
                {headerToast}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {active === "anon" && unreadAnon > 0 && (
                <span style={{ fontSize: 12, color: "#FF5D6C", fontWeight: 600 }}>{unreadAnon} new</span>
              )}
              <button
                onClick={() => setActive("earn")}
                title="Coins"
                style={{ display: "flex", alignItems: "center", gap: 5, background: dark ? "#242331" : "#F2F0E8", border: "none", borderRadius: 20, padding: "5px 10px 5px 8px", cursor: "pointer", color: "inherit" }}
              >
                <Coins size={14} color="#FFB13F" />
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{coins.toLocaleString()}</span>
              </button>
              <CreateMenu
                dark={dark}
                onPickPost={() => setActive("feed")}
                onPickReel={() => setActive("reels")}
                onPickLive={() => setActive("live")}
                onPickGroup={() => setActive("messages")}
              />
              <button onClick={() => setNotifPanelOpen((o) => !o)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                <Bell size={17} />
                {unreadNotifs > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -6, background: "#FF5D6C", color: "white", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {unreadNotifs}
                  </span>
                )}
              </button>
              {notifPanelOpen && <NotificationPanel dark={dark} notifs={notifs} setNotifs={setNotifs} onClose={() => setNotifPanelOpen(false)} />}
              <button onClick={() => setDark((d) => !d)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <button onClick={() => setActive("profile")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <MyAvatar name={name} avatarUrl={avatarUrl} size={28} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: (active === "messages" || active === "stranger" || active === "reels" || active === "live") ? "hidden" : "auto", display: "flex", minHeight: 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {active === "feed" && <Feed posts={posts} setPosts={setPosts} dark={dark} stories={stories} onOpenStory={openStoryHandler} onAddStory={addStory} onGoLive={() => setActive("live")} onOpenReels={() => setActive("reels")} onOpenAnon={() => setActive("anon")} onOpenStranger={() => setActive("stranger")} adFreeActive={adFreeActive} />}
              {active === "reels" && <Reels dark={dark} />}
              {active === "live" && <LiveStream dark={dark} name={name} onEnd={() => setActive("feed")} />}
              {active === "explore" && (
                <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
                  {boostedPostId && posts.find((p) => p.id === boostedPostId) && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#FFB13F", marginBottom: 8 }}>
                        <TrendingUp size={13} /> BOOSTED
                      </div>
                      {(() => {
                        const bp = posts.find((p) => p.id === boostedPostId);
                        return (
                          <div style={{ background: dark ? "#1B1A28" : "white", border: "1.5px solid #FFB13F", borderRadius: 12, padding: 14 }}>
                            <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                              <Avatar name={bp.name} size={30} src={avatarUrl} />
                              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{bp.name}</div>
                            </div>
                            {bp.image && <img src={bp.image} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: bp.content ? 8 : 0, maxHeight: 200, objectFit: "cover" }} />}
                            {bp.content && <div style={{ fontSize: 13.5 }}>{bp.content}</div>}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Flame size={17} color="#FF5D6C" /> Trending on Linkly
                  </div>
                  {seedTrending.map((t) => (
                    <div key={t.id} style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${dark ? "#2C2B39" : "#E7E5DE"}`, marginBottom: 10, cursor: "pointer" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#3F3DF2" }}>{t.tag}</div>
                      <div style={{ fontSize: 12, color: dark ? "#7A7869" : "#8C8A78", marginTop: 2 }}>{t.posts}</div>
                    </div>
                  ))}
                </div>
              )}
              {active === "anon" && <AnonymousInbox messages={anonMsgs} setMessages={setAnonMsgs} dark={dark} />}
              {active === "stranger" && <StrangerChat dark={dark} />}
              {active === "messages" && <Messenger threads={threads} setThreads={setThreads} dark={dark} activeThreadId={openThreadId} setActiveThreadId={setOpenThreadId} candidates={people.filter((p) => p.name !== name).map((p) => p.name)} coins={coins} onSpendCoins={spendCoins} onGoEarn={() => setActive("earn")} />}
              {active === "notifications" && <Notifications notifs={notifs} setNotifs={setNotifs} dark={dark} />}
              {active === "profile" && <ProfilePage dark={dark} name={name} bio={bio} setName={setName} setBio={setBio} posts={posts} setPosts={setPosts} onOpenChat={openChatWith} onOpenAnon={() => setActive("anon")} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} coverUrl={coverUrl} setCoverUrl={setCoverUrl} isSupporter={redeemedIds.includes("supporter")} hasFrame={redeemedIds.includes("frame")} />}
              {active === "earn" && <EarnPage dark={dark} coins={coins} coinLog={coinLog} onWatchAd={() => setShowWatchAd(true)} onDailyBonus={claimDailyBonus} dailyClaimed={dailyClaimed} onRedeem={redeemItem} redeemedIds={redeemedIds} adFreeActive={adFreeActive} />}
              {active === "settings" && <SettingsPage dark={dark} setDark={setDark} notifPrefs={notifPrefs} setNotifPrefs={setNotifPrefs} privacyPrefs={privacyPrefs} setPrivacyPrefs={setPrivacyPrefs} />}
            </div>
            {showRightPanel && <RightPanel dark={dark} suggested={suggested} setSuggested={setSuggested} trending={seedTrending} onOpenChat={openChatWith} toast={showHeaderToast} />}
          </div>
        </div>
      </div>
      {isMobile && <MobileNav active={active} setActive={setActive} dark={dark} unreadAnon={unreadAnon} unreadMsgs={unreadMsgs} unreadNotifs={unreadNotifs} />}
    </div>
  );
}
