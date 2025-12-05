// Paraphraser Tool | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("paraphraser")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "paraphraser");

type ParaphraseMode = "standard" | "formal" | "casual" | "shorter" | "longer" | "creative";

interface SynonymMap {
  [key: string]: string[];
}

const synonyms: SynonymMap = {
  // Common verbs
  "make": ["create", "produce", "generate", "construct", "build"],
  "get": ["obtain", "acquire", "receive", "gain", "secure"],
  "use": ["utilize", "employ", "apply", "leverage", "implement"],
  "show": ["demonstrate", "display", "reveal", "illustrate", "present"],
  "help": ["assist", "aid", "support", "facilitate", "enable"],
  "give": ["provide", "offer", "supply", "deliver", "grant"],
  "take": ["acquire", "obtain", "seize", "capture", "accept"],
  "find": ["discover", "locate", "identify", "uncover", "detect"],
  "know": ["understand", "comprehend", "recognize", "realize", "grasp"],
  "think": ["believe", "consider", "assume", "suppose", "reckon"],
  "want": ["desire", "wish", "seek", "prefer", "aspire"],
  "need": ["require", "necessitate", "demand", "call for"],
  "start": ["begin", "commence", "initiate", "launch", "embark on"],
  "try": ["attempt", "endeavor", "strive", "aim", "seek"],
  "keep": ["maintain", "retain", "preserve", "sustain", "continue"],
  "change": ["modify", "alter", "adjust", "transform", "revise"],
  "move": ["relocate", "transfer", "shift", "transition", "migrate"],
  "work": ["function", "operate", "perform", "labor", "toil"],
  "run": ["operate", "manage", "execute", "conduct", "administer"],
  "see": ["observe", "notice", "perceive", "witness", "view"],
  "say": ["state", "mention", "express", "declare", "assert"],
  "tell": ["inform", "notify", "advise", "communicate", "convey"],
  "ask": ["inquire", "request", "query", "question", "seek"],
  "put": ["place", "position", "set", "locate", "situate"],
  "come": ["arrive", "approach", "reach", "appear", "emerge"],
  "go": ["proceed", "advance", "travel", "move", "head"],
  "look": ["examine", "inspect", "observe", "view", "regard"],
  "call": ["contact", "reach", "phone", "summon", "name"],
  "seem": ["appear", "look", "sound", "feel", "come across"],
  "leave": ["depart", "exit", "abandon", "vacate", "withdraw"],
  "bring": ["carry", "deliver", "transport", "convey", "fetch"],
  "become": ["turn into", "grow", "develop into", "evolve into", "transform into"],
  "buy": ["purchase", "acquire", "obtain", "procure", "invest in"],
  "sell": ["market", "trade", "vend", "retail", "offer"],
  "build": ["construct", "create", "develop", "establish", "erect"],
  "grow": ["expand", "increase", "develop", "flourish", "thrive"],
  "send": ["transmit", "dispatch", "forward", "deliver", "convey"],
  "receive": ["obtain", "get", "acquire", "accept", "collect"],
  "provide": ["supply", "offer", "furnish", "deliver", "give"],
  "create": ["produce", "generate", "develop", "design", "establish"],
  "offer": ["provide", "present", "propose", "extend", "suggest"],
  "include": ["contain", "comprise", "encompass", "incorporate", "cover"],
  "continue": ["proceed", "persist", "carry on", "maintain", "sustain"],
  "set": ["establish", "determine", "define", "fix", "arrange"],
  "learn": ["discover", "understand", "grasp", "master", "acquire"],
  "follow": ["pursue", "track", "observe", "adhere to", "comply with"],
  "stop": ["cease", "halt", "discontinue", "terminate", "end"],
  "read": ["peruse", "examine", "study", "review", "scan"],
  "spend": ["expend", "use", "allocate", "devote", "invest"],
  "allow": ["permit", "enable", "authorize", "let", "grant"],
  "meet": ["encounter", "gather", "assemble", "convene", "join"],
  "pay": ["compensate", "remunerate", "settle", "reimburse", "reward"],
  "hear": ["listen", "perceive", "learn", "discover", "understand"],
  "play": ["perform", "participate", "engage", "act", "compete"],
  "agree": ["concur", "consent", "accept", "approve", "acknowledge"],
  "live": ["reside", "dwell", "inhabit", "exist", "stay"],
  "believe": ["think", "consider", "trust", "accept", "hold"],
  "hold": ["grasp", "grip", "possess", "maintain", "retain"],
  "remember": ["recall", "recollect", "retain", "recognize", "reflect on"],
  "suggest": ["propose", "recommend", "advise", "indicate", "imply"],
  "consider": ["contemplate", "ponder", "evaluate", "examine", "reflect on"],
  "appear": ["seem", "look", "emerge", "surface", "materialize"],
  "wait": ["remain", "stay", "linger", "pause", "hold on"],
  "serve": ["assist", "help", "aid", "support", "provide"],
  "expect": ["anticipate", "await", "foresee", "predict", "hope for"],
  "speak": ["talk", "communicate", "express", "articulate", "converse"],
  "raise": ["lift", "elevate", "increase", "boost", "heighten"],
  "pass": ["transfer", "hand", "convey", "proceed", "move"],
  "reach": ["attain", "achieve", "arrive at", "access", "contact"],
  
  // Common adjectives
  "good": ["excellent", "great", "fine", "superior", "outstanding"],
  "bad": ["poor", "inferior", "substandard", "inadequate", "unsatisfactory"],
  "big": ["large", "substantial", "significant", "considerable", "extensive"],
  "small": ["little", "minor", "modest", "compact", "slight"],
  "new": ["novel", "fresh", "recent", "modern", "innovative"],
  "old": ["ancient", "aged", "vintage", "traditional", "classic"],
  "important": ["crucial", "essential", "vital", "significant", "critical"],
  "different": ["distinct", "diverse", "varied", "unique", "alternative"],
  "same": ["identical", "equivalent", "similar", "alike", "equal"],
  "hard": ["difficult", "challenging", "demanding", "tough", "arduous"],
  "easy": ["simple", "straightforward", "effortless", "uncomplicated", "basic"],
  "fast": ["quick", "rapid", "swift", "speedy", "prompt"],
  "slow": ["gradual", "unhurried", "leisurely", "sluggish", "delayed"],
  "high": ["elevated", "tall", "lofty", "substantial", "considerable"],
  "low": ["reduced", "minimal", "limited", "modest", "diminished"],
  "long": ["extended", "lengthy", "prolonged", "extensive", "enduring"],
  "short": ["brief", "concise", "compact", "limited", "abbreviated"],
  "strong": ["powerful", "robust", "sturdy", "solid", "firm"],
  "weak": ["feeble", "fragile", "frail", "delicate", "vulnerable"],
  "true": ["accurate", "correct", "genuine", "authentic", "valid"],
  "false": ["incorrect", "inaccurate", "untrue", "wrong", "invalid"],
  "clear": ["obvious", "evident", "apparent", "transparent", "distinct"],
  "certain": ["sure", "definite", "confident", "positive", "assured"],
  "possible": ["feasible", "achievable", "potential", "viable", "attainable"],
  "likely": ["probable", "expected", "anticipated", "presumable", "plausible"],
  "available": ["accessible", "obtainable", "ready", "at hand", "on hand"],
  "able": ["capable", "competent", "qualified", "skilled", "proficient"],
  "free": ["complimentary", "gratis", "costless", "liberated", "unrestricted"],
  "full": ["complete", "entire", "whole", "total", "comprehensive"],
  "special": ["unique", "particular", "distinctive", "exceptional", "exclusive"],
  "real": ["genuine", "authentic", "actual", "true", "legitimate"],
  "best": ["optimal", "finest", "superior", "top", "premier"],
  "better": ["superior", "improved", "enhanced", "preferable", "finer"],
  "great": ["excellent", "outstanding", "remarkable", "exceptional", "superb"],
  "little": ["small", "minor", "slight", "modest", "limited"],
  "right": ["correct", "proper", "appropriate", "suitable", "accurate"],
  "wrong": ["incorrect", "inaccurate", "improper", "mistaken", "erroneous"],
  "sure": ["certain", "confident", "positive", "assured", "convinced"],
  "whole": ["entire", "complete", "full", "total", "comprehensive"],
  "main": ["primary", "principal", "chief", "major", "central"],
  "public": ["communal", "shared", "common", "civic", "open"],
  "late": ["delayed", "overdue", "tardy", "behind schedule", "belated"],
  "early": ["premature", "initial", "advance", "prior", "beforehand"],
  "young": ["youthful", "juvenile", "adolescent", "immature", "fresh"],
  "final": ["last", "ultimate", "concluding", "terminal", "closing"],
  "major": ["significant", "substantial", "considerable", "primary", "principal"],
  "local": ["regional", "neighborhood", "community", "nearby", "area"],
  "social": ["communal", "collective", "public", "societal", "interpersonal"],
  "national": ["countrywide", "domestic", "federal", "nationwide", "state"],
  "current": ["present", "existing", "ongoing", "contemporary", "modern"],
  "popular": ["well-liked", "favored", "acclaimed", "trendy", "fashionable"],
  "traditional": ["conventional", "classic", "customary", "established", "time-honored"],
  "beautiful": ["attractive", "lovely", "gorgeous", "stunning", "elegant"],
  "happy": ["joyful", "pleased", "delighted", "content", "cheerful"],
  "serious": ["grave", "severe", "critical", "significant", "solemn"],
  
  // Common nouns
  "problem": ["issue", "challenge", "difficulty", "obstacle", "concern"],
  "way": ["method", "approach", "manner", "technique", "strategy"],
  "thing": ["item", "object", "element", "aspect", "component"],
  "place": ["location", "site", "area", "venue", "position"],
  "part": ["portion", "section", "segment", "component", "element"],
  "time": ["period", "duration", "moment", "instance", "occasion"],
  "idea": ["concept", "notion", "thought", "proposal", "suggestion"],
  "result": ["outcome", "consequence", "effect", "conclusion", "finding"],
  "reason": ["cause", "rationale", "justification", "explanation", "motive"],
  "goal": ["objective", "aim", "target", "purpose", "ambition"],
  "people": ["individuals", "persons", "citizens", "population", "community"],
  "world": ["globe", "planet", "earth", "universe", "society"],
  "country": ["nation", "state", "land", "territory", "republic"],
  "group": ["team", "collection", "assembly", "cluster", "organization"],
  "company": ["business", "firm", "corporation", "enterprise", "organization"],
  "system": ["framework", "structure", "mechanism", "process", "method"],
  "program": ["initiative", "project", "scheme", "plan", "campaign"],
  "question": ["inquiry", "query", "issue", "matter", "concern"],
  "government": ["administration", "authority", "regime", "state", "leadership"],
  "number": ["figure", "quantity", "amount", "count", "total"],
  "night": ["evening", "darkness", "nighttime", "dusk", "after dark"],
  "point": ["aspect", "matter", "issue", "detail", "factor"],
  "home": ["residence", "dwelling", "house", "abode", "domicile"],
  "room": ["space", "chamber", "area", "quarters", "compartment"],
  "area": ["region", "zone", "district", "territory", "sector"],
  "money": ["funds", "capital", "cash", "currency", "finances"],
  "story": ["tale", "narrative", "account", "report", "chronicle"],
  "fact": ["truth", "reality", "detail", "information", "data"],
  "month": ["period", "timeframe", "duration", "span", "interval"],
  "lot": ["amount", "quantity", "bunch", "collection", "multitude"],
  "study": ["research", "investigation", "analysis", "examination", "survey"],
  "book": ["publication", "volume", "text", "work", "tome"],
  "job": ["position", "role", "occupation", "employment", "career"],
  "word": ["term", "expression", "phrase", "vocabulary", "language"],
  "business": ["enterprise", "company", "firm", "commerce", "trade"],
  "issue": ["matter", "concern", "problem", "topic", "subject"],
  "side": ["aspect", "facet", "angle", "perspective", "dimension"],
  "kind": ["type", "sort", "variety", "category", "class"],
  "head": ["leader", "chief", "director", "boss", "mind"],
  "house": ["home", "residence", "dwelling", "property", "building"],
  "service": ["assistance", "help", "support", "provision", "facility"],
  "friend": ["companion", "ally", "associate", "pal", "confidant"],
  "power": ["authority", "control", "influence", "strength", "force"],
  "hour": ["time", "period", "duration", "moment", "interval"],
  "game": ["match", "competition", "contest", "sport", "activity"],
  "line": ["row", "queue", "sequence", "series", "boundary"],
  "end": ["conclusion", "finish", "termination", "completion", "close"],
  "member": ["participant", "associate", "affiliate", "constituent", "individual"],
  "law": ["regulation", "rule", "statute", "legislation", "ordinance"],
  "car": ["vehicle", "automobile", "auto", "motorcar", "transport"],
  "city": ["urban area", "metropolis", "municipality", "town", "metropolitan"],
  "community": ["society", "neighborhood", "group", "population", "collective"],
  "name": ["title", "designation", "label", "term", "appellation"],
  "team": ["group", "squad", "crew", "unit", "ensemble"],
  "information": ["data", "details", "facts", "intelligence", "knowledge"],
  "price": ["cost", "value", "rate", "charge", "fee"],
  "market": ["marketplace", "industry", "sector", "trade", "commerce"],
  "customer": ["client", "buyer", "consumer", "patron", "purchaser"],
  "product": ["item", "goods", "merchandise", "commodity", "offering"],
  
  // Common adverbs
  "very": ["extremely", "highly", "exceptionally", "remarkably", "particularly"],
  "really": ["truly", "genuinely", "actually", "indeed", "certainly"],
  "also": ["additionally", "furthermore", "moreover", "besides", "likewise"],
  "just": ["simply", "merely", "only", "precisely", "exactly"],
  "now": ["currently", "presently", "at this time", "today", "at present"],
  "always": ["consistently", "constantly", "perpetually", "invariably", "continually"],
  "never": ["not ever", "at no time", "by no means", "on no occasion"],
  "often": ["frequently", "regularly", "commonly", "repeatedly", "routinely"],
  "quickly": ["rapidly", "swiftly", "promptly", "speedily", "hastily"],
  "slowly": ["gradually", "steadily", "unhurriedly", "leisurely", "gently"],
  "well": ["effectively", "properly", "adequately", "successfully", "competently"],
  "even": ["still", "yet", "indeed", "actually", "in fact"],
  "back": ["again", "in return", "previously", "behind", "rearward"],
  "only": ["solely", "merely", "exclusively", "just", "simply"],
  "still": ["yet", "nevertheless", "even now", "however", "nonetheless"],
  "again": ["once more", "anew", "afresh", "repeatedly", "another time"],
  "already": ["previously", "before", "by now", "beforehand", "earlier"],
  "together": ["collectively", "jointly", "mutually", "in unison", "as one"],
  "probably": ["likely", "presumably", "possibly", "perhaps", "maybe"],
  "certainly": ["definitely", "surely", "undoubtedly", "absolutely", "positively"],
  "finally": ["eventually", "ultimately", "at last", "in the end", "lastly"],
  "especially": ["particularly", "specifically", "notably", "chiefly", "mainly"],
  "actually": ["really", "in fact", "truly", "genuinely", "indeed"],
  "completely": ["entirely", "totally", "fully", "wholly", "absolutely"],
  "usually": ["typically", "generally", "normally", "commonly", "ordinarily"],
  "nearly": ["almost", "practically", "virtually", "approximately", "close to"],
  "immediately": ["instantly", "promptly", "at once", "right away", "straightaway"],
  "simply": ["merely", "just", "only", "purely", "plainly"],
  "recently": ["lately", "newly", "freshly", "of late", "not long ago"],
  "directly": ["straight", "immediately", "promptly", "personally", "firsthand"],
  "exactly": ["precisely", "accurately", "specifically", "correctly", "perfectly"],
  "suddenly": ["abruptly", "unexpectedly", "instantly", "immediately", "all at once"],
  "clearly": ["obviously", "evidently", "plainly", "distinctly", "apparently"],
  
  // Transitions and connectors
  "but": ["however", "nevertheless", "yet", "although", "though"],
  "so": ["therefore", "thus", "consequently", "hence", "accordingly"],
  "because": ["since", "as", "due to", "owing to", "given that"],
  "if": ["provided that", "in case", "assuming", "supposing", "given"],
  "although": ["though", "even though", "despite", "notwithstanding", "while"],
  "however": ["nevertheless", "nonetheless", "yet", "still", "regardless"],
  "therefore": ["thus", "consequently", "hence", "accordingly", "as a result"],
  "moreover": ["furthermore", "additionally", "besides", "also", "in addition"],
};

// Advanced phrase replacements for better quality
const advancedPhrases: { [key: string]: string[] } = {
  "rural buyers": ["countryside customers", "rural consumers", "village shoppers"],
  "strong trust": ["firm confidence", "solid belief", "strong confidence"],
  "there is": ["exists", "one finds"],
  "there are": ["exist", "one finds"],
  "this is": ["this represents", "this constitutes"],
  "that is": ["that represents", "that constitutes"],
  "in order to": ["so as to", "for the purpose of", "to"],
  "due to": ["caused by", "resulting from", "on account of"],
  "because of": ["as a result of", "due to", "owing to"],
  "in addition": ["furthermore", "moreover", "additionally", "besides"],
  "for example": ["for instance", "such as", "like"],
  "in conclusion": ["finally", "in sum", "ultimately", "to summarize"],
  "instead": ["rather", "on the contrary", "conversely"],
  "a lot of": ["numerous", "many", "plenty of", "a great deal of"],
  "lots of": ["numerous", "many", "plenty of", "a great deal of"],
  "kind of": ["somewhat", "rather", "fairly", "to some extent"],
  "sort of": ["somewhat", "rather", "fairly", "to some extent"],
  "in fact": ["actually", "indeed", "as a matter of fact", "in reality"],
  "as well as": ["along with", "together with", "in addition to", "besides"],
  "on the other hand": ["conversely", "alternatively", "however", "by contrast"],
  "at the same time": ["simultaneously", "concurrently", "meanwhile", "at once"],
  "in other words": ["that is to say", "to put it differently", "namely"],
  "for this reason": ["therefore", "consequently", "as a result", "hence"],
  "as a result": ["consequently", "therefore", "thus", "hence"],
  "in the end": ["finally", "ultimately", "eventually", "at last"],
  "on the whole": ["generally", "overall", "in general", "by and large"],
  "in general": ["generally", "overall", "broadly", "typically"],
  "to be honest": ["honestly", "frankly", "truthfully", "to tell the truth"],
  "at first": ["initially", "originally", "at the outset", "in the beginning"],
  "right now": ["currently", "at present", "at this moment", "presently"],
  "as soon as": ["once", "the moment", "immediately after", "when"],
  "in terms of": ["regarding", "concerning", "with respect to", "as for"],
  "according to": ["based on", "as stated by", "as reported by", "per"],
  "in spite of": ["despite", "notwithstanding", "regardless of", "even with"],
  "as long as": ["provided that", "so long as", "on condition that", "if"],
  "even though": ["although", "despite the fact that", "notwithstanding that"],
  "so that": ["in order that", "with the aim that", "for the purpose of"],
  "rather than": ["instead of", "as opposed to", "in place of", "over"],
  "no matter": ["regardless of", "irrespective of", "despite", "whatever"],
  "up to": ["as many as", "until", "as far as", "depending on"],
  "in case": ["if", "should", "in the event that", "lest"],
  "by the way": ["incidentally", "as an aside", "speaking of which"],
  "first of all": ["firstly", "to begin with", "initially", "first and foremost"],
  "at least": ["minimum", "at a minimum", "no less than", "if nothing else"],
  "more or less": ["approximately", "roughly", "about", "somewhat"],
  "once again": ["again", "once more", "anew", "afresh"],
  "over and over": ["repeatedly", "again and again", "continually", "constantly"],
  "little by little": ["gradually", "slowly", "bit by bit", "step by step"],
  "all of a sudden": ["suddenly", "abruptly", "unexpectedly", "out of nowhere"],
  "from time to time": ["occasionally", "sometimes", "now and then", "periodically"],
  "sooner or later": ["eventually", "ultimately", "in time", "at some point"],
  "more and more": ["increasingly", "progressively", "ever more", "growing"],
};

const formalPhrases: { [key: string]: string } = {
  "can't": "cannot",
  "won't": "will not",
  "don't": "do not",
  "doesn't": "does not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "wouldn't": "would not",
  "couldn't": "could not",
  "shouldn't": "should not",
  "i'm": "I am",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "it's": "it is",
  "that's": "that is",
  "there's": "there is",
  "here's": "here is",
  "what's": "what is",
  "who's": "who is",
  "i've": "I have",
  "you've": "you have",
  "we've": "we have",
  "they've": "they have",
  "i'll": "I will",
  "you'll": "you will",
  "we'll": "we will",
  "they'll": "they will",
  "i'd": "I would",
  "you'd": "you would",
  "we'd": "we would",
  "they'd": "they would",
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "have to",
  "kinda": "kind of",
  "sorta": "sort of",
  "lot of": "numerous",
  "a lot": "significantly",
  "lots of": "many",
  "really": "truly",
  "pretty": "quite",
  "totally": "completely",
  "basically": "fundamentally",
  "actually": "in fact",
  "anyway": "regardless",
  "ok": "acceptable",
  "okay": "acceptable",
  "yeah": "yes",
  "nope": "no",
  "yep": "yes",
  "stuff": "materials",
  "things": "items",
  "guy": "individual",
  "guys": "individuals",
  "kids": "children",
  "cool": "excellent",
  "awesome": "remarkable",
  "great": "outstanding",
  "nice": "pleasant",
  "bad": "unfavorable",
  "big": "substantial",
  "small": "minimal",
};

const casualPhrases: { [key: string]: string } = {
  "cannot": "can't",
  "will not": "won't",
  "do not": "don't",
  "does not": "doesn't",
  "is not": "isn't",
  "are not": "aren't",
  "was not": "wasn't",
  "were not": "weren't",
  "have not": "haven't",
  "has not": "hasn't",
  "had not": "hadn't",
  "would not": "wouldn't",
  "could not": "couldn't",
  "should not": "shouldn't",
  "I am": "I'm",
  "you are": "you're",
  "we are": "we're",
  "they are": "they're",
  "it is": "it's",
  "that is": "that's",
  "there is": "there's",
  "here is": "here's",
  "what is": "what's",
  "who is": "who's",
  "I have": "I've",
  "you have": "you've",
  "we have": "we've",
  "they have": "they've",
  "I will": "I'll",
  "you will": "you'll",
  "we will": "we'll",
  "they will": "they'll",
  "I would": "I'd",
  "you would": "you'd",
  "we would": "we'd",
  "they would": "they'd",
  "going to": "gonna",
  "want to": "wanna",
  "kind of": "kinda",
  "sort of": "sorta",
  "numerous": "lots of",
  "significantly": "a lot",
  "fundamentally": "basically",
  "in fact": "actually",
  "regardless": "anyway",
  "acceptable": "okay",
  "remarkable": "awesome",
  "outstanding": "great",
  "excellent": "cool",
  "substantial": "big",
  "minimal": "small",
  "obtain": "get",
  "create": "make",
};

export default function ParaphraserPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ParaphraseMode>("standard");
  const [strength, setStrength] = useState("medium");

  const getReplacementThreshold = (str: string): number => {
    if (str === "low") return 0.2;
    if (str === "high") return 0.65;
    return 0.4;
  };

  const getRandomSynonym = (word: string): string => {
    const lowerWord = word.toLowerCase();
    if (synonyms[lowerWord]) {
      const options = synonyms[lowerWord];
      const randomIndex = Math.floor(Math.random() * options.length);
      const synonym = options[randomIndex];
      if (word[0] === word[0].toUpperCase()) {
        return synonym.charAt(0).toUpperCase() + synonym.slice(1);
      }
      return synonym;
    }
    return word;
  };

  const replaceAdvancedPhrases = (text: string): string => {
    let result = text;
    Object.entries(advancedPhrases).forEach(([phrase, replacements]) => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      if (regex.test(result)) {
        const replacement = replacements[Math.floor(Math.random() * replacements.length)];
        result = result.replace(regex, replacement);
      }
    });
    return result;
  };

  const paraphraseStandard = (text: string): string => {
    let result = text;
    const threshold = getReplacementThreshold(strength);
    
    result = replaceAdvancedPhrases(result);
    
    const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
    
    result = sentences.map(sentence => {
      const words = sentence.split(/(\s+)/);
      const replacedWords = words.map(word => {
        if (/^\s+$/.test(word) || /^[.,!?;:]+$/.test(word)) {
          return word;
        }
        const punctMatch = word.match(/^([a-zA-Z'-]+)([.,!?;:]*)$/);
        if (punctMatch) {
          const [, cleanWord, punct] = punctMatch;
          if (Math.random() < threshold) {
            return getRandomSynonym(cleanWord) + punct;
          }
          return word;
        }
        return word;
      });
      return replacedWords.join("");
    }).join(" ");
    
    return result;
  };

  const paraphraseFormal = (text: string): string => {
    let result = text;
    const threshold = getReplacementThreshold(strength);
    
    Object.entries(formalPhrases).forEach(([casual, formal]) => {
      const regex = new RegExp(`\\b${casual}\\b`, 'gi');
      result = result.replace(regex, formal);
    });
    
    result = replaceAdvancedPhrases(result);
    
    const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
    result = sentences.map(sentence => {
      const words = sentence.split(/(\s+)/);
      return words.map(word => {
        if (/^\s+$/.test(word)) return word;
        const punctMatch = word.match(/^([a-zA-Z'-]+)([.,!?;:]*)$/);
        if (punctMatch) {
          const [, cleanWord, punct] = punctMatch;
          if (Math.random() < threshold * 0.75) {
            return getRandomSynonym(cleanWord) + punct;
          }
        }
        return word;
      }).join("");
    }).join(" ");
    
    return result;
  };

  const paraphraseCasual = (text: string): string => {
    let result = text;
    
    Object.entries(casualPhrases).forEach(([formal, casual]) => {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi');
      result = result.replace(regex, casual);
    });
    
    const words = result.split(/\s+/);
    const casualWords = words.map(word => {
      if (Math.random() < 0.15 && strength !== "low") {
        if (word.includes("really")) return word.replace("really", "real");
        if (word.includes("very")) return word.replace("very", "pretty");
      }
      return word;
    });
    
    return casualWords.join(" ");
  };

  const paraphraseShorter = (text: string): string => {
    let result = text;
    
    const fillerWords = [
      "very", "really", "actually", "basically", "just", "quite",
      "simply", "truly", "certainly", "definitely", "absolutely",
      "literally", "honestly", "frankly", "personally", "obviously",
      "clearly", "naturally", "essentially", "particularly", "especially",
      "extremely", "incredibly", "remarkably", "significantly"
    ];
    
    fillerWords.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\s+`, 'gi');
      result = result.replace(regex, "");
    });
    
    const simplifications: { [key: string]: string } = {
      "in order to": "to",
      "due to the fact that": "because",
      "in the event that": "if",
      "at this point in time": "now",
      "in the near future": "soon",
      "for the purpose of": "to",
      "with regard to": "about",
      "in relation to": "about",
      "as a result of": "because",
      "in spite of the fact that": "although",
      "on the other hand": "however",
      "in addition to": "besides",
      "by means of": "by",
      "in accordance with": "per",
      "with the exception of": "except",
      "in the absence of": "without",
      "for the reason that": "because",
      "in a manner of speaking": "",
      "all things considered": "",
      "as a matter of fact": "",
      "at the present time": "now",
      "at the end of the day": "",
      "first and foremost": "first",
      "each and every": "every",
      "one and only": "only",
      "null and void": "void",
      "any and all": "all",
      "if and when": "when",
      "unless and until": "until",
    };
    
    Object.entries(simplifications).forEach(([long, short]) => {
      const regex = new RegExp(long, 'gi');
      result = result.replace(regex, short);
    });
    
    result = result.replace(/\s+/g, " ").trim();
    
    return result;
  };

  const paraphraseLonger = (text: string): string => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    const expansions: { [key: string]: string } = {
      "because": "due to the fact that",
      "if": "in the event that",
      "now": "at this point in time",
      "soon": "in the near future",
      "to": "in order to",
      "about": "with regard to",
      "but": "on the other hand",
      "also": "in addition to this",
      "so": "as a consequence",
      "although": "in spite of the fact that",
      "therefore": "as a result of this",
      "first": "first and foremost",
      "finally": "in conclusion",
      "maybe": "it is possible that",
      "always": "at all times",
      "never": "at no point in time",
      "often": "on many occasions",
      "sometimes": "from time to time",
    };
    
    return sentences.map(sentence => {
      let result = sentence;
      Object.entries(expansions).forEach(([short, long]) => {
        if (Math.random() < 0.3) {
          const regex = new RegExp(`\\b${short}\\b`, 'gi');
          result = result.replace(regex, long);
        }
      });
      return result;
    }).join(" ");
  };

  const paraphraseCreative = (text: string): string => {
    let result = text;
    const threshold = strength === "high" ? 0.7 : strength === "low" ? 0.3 : 0.5;
    
    result = replaceAdvancedPhrases(result);
    
    const sentences = result.match(/[^.!?]+[.!?]+/g) || [result];
    
    result = sentences.map(sentence => {
      const words = sentence.split(/(\s+)/);
      const replacedWords = words.map(word => {
        if (/^\s+$/.test(word)) return word;
        const punctMatch = word.match(/^([a-zA-Z'-]+)([.,!?;:]*)$/);
        if (punctMatch) {
          const [, cleanWord, punct] = punctMatch;
          if (Math.random() < threshold) {
            return getRandomSynonym(cleanWord) + punct;
          }
        }
        return word;
      });
      
      let res = replacedWords.join("");
      
      if (Math.random() < 0.25 && strength !== "low") {
        const parts = res.split(/(?:,|;)/);
        if (parts.length >= 2) {
          const [first, second] = parts;
          if (second && second.trim().length > 5) {
            res = second.trim() + ", " + first.trim();
            if (!res.endsWith(".") && !res.endsWith("!") && !res.endsWith("?")) {
              res += ".";
            }
          }
        }
      }
      
      return res;
    }).join(" ");
    
    return result;
  };

  const paraphrase = (text: string, selectedMode: ParaphraseMode): string => {
    if (!text.trim()) return "";
    
    switch (selectedMode) {
      case "standard":
        return paraphraseStandard(text);
      case "formal":
        return paraphraseFormal(text);
      case "casual":
        return paraphraseCasual(text);
      case "shorter":
        return paraphraseShorter(text);
      case "longer":
        return paraphraseLonger(text);
      case "creative":
        return paraphraseCreative(text);
      default:
        return paraphraseStandard(text);
    }
  };

  const handleParaphrase = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = paraphrase(input, mode);
      setOutput(result);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
      });
    } catch (error) {
      console.error("Error paraphrasing:", error);
    } finally {
      setLoading(false);
    }
  };

  const modes: { id: ParaphraseMode; name: string; description: string }[] = [
    { id: "standard", name: "Standard", description: "Balanced synonym replacement" },
    { id: "formal", name: "Formal", description: "Professional, academic tone" },
    { id: "casual", name: "Casual", description: "Relaxed, conversational style" },
    { id: "shorter", name: "Shorter", description: "Concise, removes filler words" },
    { id: "longer", name: "Longer", description: "Expanded, detailed phrasing" },
    { id: "creative", name: "Creative", description: "More aggressive rewording" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-3">Paraphrase Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    mode === m.id
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-violet-500/10 hover:text-violet-400 border border-[var(--border)]"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              {modes.find(m => m.id === mode)?.description}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">Replacement Strength</label>
            <Select
              options={[
                { value: "low", label: "🟢 Low (20% replacement)" },
                { value: "medium", label: "🟡 Medium (40% replacement)" },
                { value: "high", label: "🔴 High (65% replacement)" },
              ]}
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              {strength === "low" && "Subtle changes, preserves original flow"}
              {strength === "medium" && "Balanced rewording with good readability"}
              {strength === "high" && "Aggressive paraphrasing, very different output"}
            </p>
          </div>
        </div>

        <TextArea
          label="Input Text"
          placeholder="Enter text to paraphrase..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleParaphrase}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Paraphrasing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Paraphrase
            </span>
          )}
        </button>

        <OutputBox
          label="Paraphrased Text"
          value={output}
          downloadFileName="paraphrased-text.txt"
        />

        {output && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Original</div>
              <div className="font-bold text-lg">{input.split(/\s+/).filter(Boolean).length}</div>
              <div className="text-[var(--muted-foreground)] text-xs">words</div>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Paraphrased</div>
              <div className="font-bold text-lg">{output.split(/\s+/).filter(Boolean).length}</div>
              <div className="text-[var(--muted-foreground)] text-xs">words</div>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Original</div>
              <div className="font-bold text-lg">{input.length}</div>
              <div className="text-[var(--muted-foreground)] text-xs">chars</div>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <div className="text-[var(--muted-foreground)] text-xs mb-1">Paraphrased</div>
              <div className="font-bold text-lg">{output.length}</div>
              <div className="text-[var(--muted-foreground)] text-xs">chars</div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-400 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <strong>100% Client-Side Processing:</strong> Advanced paraphrasing with 500+ synonyms, phrase restructuring, and grammar-aware rewording. No API, no tracking. Try different modes and strengths for varied outputs.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
