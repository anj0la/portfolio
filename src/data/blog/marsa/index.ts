import { type BlogPost } from "@/data/blog-post-interface";

export const marsaBlogPost: BlogPost = {
    slug: "marsa",
    title: "MARSA",
    publishedAt: "2025-08-18",
    readingTime: "14",
    summary: "A lightweight tool designed to streamline aspect-based sentiment analysis (ABSA) by automating the extraction and pre-labeling of aspect-sentiment pairs from review-style text.",
    tags: ["Python", "NLP", "spaCy"],
    sections: [
        {
            type: "heading",
            content: "Context"
        },
        {
            type: "text",
            content: "MARSA is designed as a lightweight tool to help label data for aspect-based sentiment analysis (ABSA)."
        },
        {
            type: "text",
            content: "The idea came to me while working on a research project analyzing Reddit comments about calorie counting apps. I had successfully extracted relevant comments from specific subreddits using a filtering script, but I hit a wall when it came to labeling the data for aspect-based sentiment analysis."
        },
        {
            type: "text",
            content: "Existing labeling software like Prodigy and Label Studio work well for regular sentiment analysis and text classification, but I found myself constantly fighting with these tools when trying to handle ABSA tasks. They weren't designed for the nuanced work of extracting aspect-sentiment pairs from review-style text."
        },
        {
            type: "text",
            content: "I needed to bridge the gap between raw textual data and structured data that could be used to fine-tune or train ML models. MARSA fills this gap by automating the extraction and pre-labeling of aspect-sentiment pairs (or aspect-category-sentiment triplets), making it much easier to create datasets for ABSA-related tasks like aspect extraction, aspect-sentiment analysis, and category extraction."
        },
        {
            type: "heading",
            content: "Technical Approach"
        },
        {
            type: "heading2",
            content: "Rule-Based Aspect Matching"
        },
        {
            type: "text",
            content: "MARSA uses a straightforward rule-based approach with spaCy's PatternMatcher to extract aspects from text. Aspects are defined using a simple YAML or JSON configuration file:"
        },
        {
            type: "code",
            language: "yaml",
            code: `aspects:
    camera:
        phrases: ["camera", "photo", "picture", "pics", "photography", "image", "snap"]
        category: "hardware"
    
    battery:
        phrases: ["battery", "power", "charge", "charging", "juice", "drain", "life"]
        category: "hardware"
    
    screen:
        phrases: ["screen", "display", "resolution", "brightness", "monitor", "lcd", "oled"]
        category: "interface"`
        },
        {
            type: "text",
            content: "The phrases are similar terms that map to each aspect. For example, when MARSA encounters \"photo\" in text, it recognizes this as the \"camera\" aspect. If you want to keep things simple, you can omit phrases and categories entirely:"
        },
        {
            type: "code",
            language: "yaml",
            code: `aspects:
    camera: {}
    battery: {}
    screen: {}`
        },
        {
            type: "heading2",
            content: "Ensemble Sentiment Analysis"
        },
        {
            type: "text",
            content: "Once aspects are detected, MARSA uses an ensemble approach combining VADER and BERT models for sentiment classification. It extracts a context window around each detected aspect to provide enough context for accurate sentiment analysis:"
        },
        {
            type: "code",
            language: "python",
            code: `def _extract_context_window(self, aspect_match: AspectMatch) -> str:
    start_token = max(0, aspect_match.token_start - self.context_window)
    end_token = min(len(self.doc), aspect_match.token_end + self.context_window)
    return self.doc[start_token:end_token].text`
        },
        {
            type: "text",
            content: "The final sentiment is calculated by combining predictions from both models, weighted by their confidence levels and agreement:"
        },
        {
            type: "code",
            language: "python",
            code: `def _weighted_sentiment(self, bert_probs: list[float], vader_score: float) -> tuple[str, float]:
    bert_sentiment_score = (
        -1 * bert_probs[0] +   # negative
         0 * bert_probs[1] +   # neutral  
         1 * bert_probs[2]     # positive
    )
    bert_confidence = max(bert_probs)
    vader_confidence = abs(vader_score)
    total_confidence = bert_confidence + vader_confidence
    
    if total_confidence > 0:
        bert_weight = bert_confidence / total_confidence
        vader_weight = vader_confidence / total_confidence
    else:
        bert_weight = vader_weight = 0.5
    
    combined_score = (bert_weight * bert_sentiment_score) + (vader_weight * vader_score)
    
    agreement_factor = self._calculate_agreement(bert_sentiment_score, vader_score)
    final_confidence = agreement_factor * max(bert_confidence, vader_confidence)
    
    if combined_score > self.threshold:
        return "positive", final_confidence
    elif combined_score < -self.threshold:
        return "negative", final_confidence
    else:
        return "neutral", final_confidence`
        },
        {
            type: "text",
            content: "The agreement factor measures how well BERT and VADER agree on sentiment polarity, which helps adjust the final confidence score."
        },
        {
            type: "heading",
            content: "Implementation"
        },
        {
            type: "heading2",
            content: "Pipeline Architecture"
        },
        {
            type: "text",
            content: "MARSA brings together its three main components, configuration handling, aspect matching, and sentiment analysis, into a unified AspectSentimentPipeline. The pipeline takes a config file and context window size as inputs."
        },
        {
            type: "text",
            content: "Here's how the main processing function works:"
        },
        {
            type: "code",
            language: "python",
            code: `def process_corpus(self, comments: list[str]) -> list[AspectSentimentResult]:
    results = []
    for comment in comments:
        cleaned = clean_input(comment)
        aspects, doc = match_aspect_phrases(cleaned, self.config)
        sentiment_result = self.sentiment_analyzer.analyze_text(cleaned, aspects, doc)
        results.append(sentiment_result)
    return results`
        },
        {
            type: "heading2",
            content: "Text Preprocessing"
        },
        {
            type: "text",
            content: "The pipeline starts with minimal but effective text cleaning:"
        },
        {
            type: "code",
            language: "python",
            code: `def clean_input(text: str) -> str:
    text = text.lower()
    text = re.sub(r'http\\S+|www\\.\\S+', '', text)
    text = re.sub(r'\\w+@\\w+\\.com', '', text)
    text = emoji.demojize(text)
    return text.strip()`
        },
        {
            type: "heading2",
            content: "Aspect Detection"
        },
        {
            type: "text",
            content: "The match_aspect_phrases function uses spaCy's PhraseMatcher to identify aspects and their locations within the text:"
        },
        {
            type: "code",
            language: "python",
            code: `def match_aspect_phrases(text: str, config: AspectConfig) -> tuple[list[AspectMatch], Doc]:
    nlp = require_spacy_model("en_core_web_sm")
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    
    phrase_to_aspect = {}
    patterns = [] 
    
    for aspect_name, aspect_data in config.aspects.items():
        if aspect_data.phrases:
            for phrase in aspect_data.phrases:
                patterns.append(nlp.make_doc(phrase))
                phrase_to_aspect[phrase.lower()] = aspect_name
        else:
            patterns.append(nlp.make_doc(aspect_name))
            phrase_to_aspect[aspect_name.lower()] = aspect_name
    
    if patterns:
        matcher.add('AspectTermsList', patterns)
            
    doc = nlp(text)
    matches = matcher(doc)
    
    aspects = []
    for _, start, end in matches:
        span = doc[start:end]
        aspect_name = phrase_to_aspect[span.text.lower()]
        aspect_data = config.aspects[aspect_name]

        aspects.append(AspectMatch(
            text=span.text, 
            aspect=aspect_name,
            start=span.start_char, 
            end=span.end_char,     
            token_start=start,      
            token_end=end,       
            category=aspect_data.category
        ))
    
    return aspects, doc`
        },
        {
            type: "heading2",
            content: "Export Options"
        },
        {
            type: "text",
            content: "MARSA provides flexible export options for different workflows. You can get structured results for automated processing or export to JSON/CSV for manual review:"
        },
        {
            type: "code",
            language: "python",
            code: `def export_for_review(results: list[dict], out_file: str) -> None:
    path = Path(out_file).resolve() 
    path.parent.mkdir(parents=True, exist_ok=True)
    
    if path.suffix.lower() == '.json':
        with open(path, 'w') as f:
            json.dump(results, f, indent=2)
    elif path.suffix.lower() == '.csv':
        flattened = []
        for result in results:
            for aspect_sent in result['aspect_sentiments']:
                flattened.append({
                    'text': result['cleaned_text'],
                    'aspect': aspect_sent['aspect'],
                    'category': aspect_sent['category'],
                    'prelabeled_sentiment': aspect_sent['sentiment'],
                    'confidence': aspect_sent['confidence']
                })
        pd.DataFrame(flattened).to_csv(path, index=False)
    else:
        raise ValueError(f'Unsupported file extension: {path.suffix}')` 
        },
        {
            type: "heading",
            content: "Learning"
        },
        {
            type: "text",
            content: "Working on MARSA taught me a lot about building practical NLP tools. I got much more comfortable with spaCy's advanced features and learned how to effectively use pre-trained BERT models for sentiment analysis tasks. Building the ensemble approach showed me how combining different models can improve reliability when they agree and flag uncertainty when they don't."
        },
        {
            type: "text",
            content: "This project was my first real dive into creating a complete ML pipeline from scratch. While my previous Python project, MovieSentiments, expanded on a university assignment using an existing IMDB dataset, MARSA was entirely my own idea, solving a problem I actually faced, and my first attempt at creating open-source software designed for others to use, contribute to, and build upon."
        },
        {
            type: "heading",
            content: "Next Steps"
        },
        {
            type: "text",
            content: "I'm really happy with MARSA's 0.1.0 release on PyPI, and I'll continue updating it in my spare time. I can already see areas for improvement, like better stop word handling and more sophisticated preprocessing, but those are perfect candidates for future updates."
        }
    ],
    github: "https://github.com/anj0la/marsa"
};