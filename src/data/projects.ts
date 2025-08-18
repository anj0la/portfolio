export const projects = [
    {
        slug: "penguinframework",
        title: "Penguin Framework",
        tags: ["C++", "SDL", "CMake"],
        desc: "A lightweight 2D game framework built from scratch.",
        language: "cpp",
        code_snippet_title: "sprite_impl.cpp",
        code_snippet: `// sprite_impl.cpp
bool SpriteImpl::update_screen_placement() {
	// Texture is invalid, nothing should be rendered onto the screen
	if (!texture) {
		screen_placement = penguin::math::Rect2{ penguin::math::Vector2::Zero, penguin::math::Vector2::Zero };
		return false;
	}

	// Otherwise, we update the screen placement with the position and scale_factor
	penguin::math::Vector2 base_size{ texture_region.size.x, texture_region.size.y };

	// Texture is valid, but the source portion defines a zero-area
	if (base_size.x <= 0 || base_size.y <= 0) { // same as base_size <= Vector2::Zero, but more readable
		screen_placement = penguin::math::Rect2{ penguin::math::Vector2::Zero, penguin::math::Vector2::Zero };  
		return false;
	}

	// Texture is valid, and the source portion defines a valid non-zero area
	penguin::math::Vector2 final_size = base_size * scale_factor;
	penguin::math::Vector2 pixel_anchor = anchor * final_size;
	penguin::math::Vector2 final_position = position - pixel_anchor;

	screen_placement = penguin::math::Rect2{ final_position, final_size };

	return true; // successfuly updated screen placement
}`,
        github: "https://github.com/anj0la/penguin_framework",
    },
    {
        slug: "aera",
        title: "Aera",
        tags: ["C++", "CMake", "Programming Languages"],
        desc: "A programming language for interactive applications.",
        language: "cpp",
        code_snippet_title: "diagnostics.cpp",
        code_snippet: `// diagnostics.cpp
void DiagnosticReporter::print_diagnostic(const Diagnostic& d) {
    std::cerr << d.filepath << ":" << d.loc.line << ":" << d.loc.col
        << ": " << severity_to_string() << ": " << d.msg << std::endl;

    if (d.severity == Diagnostic::Severity::Error || d.severity == Diagnostic::Severity::Warning) {  
        std::cerr << "    " << d.source_line << std::endl;
    }

    std::cerr << std::string(d.loc.col - 1, ' ') << "^";

    if (d.token_length > 0) {
        for (size_t = 1; i < d.token_length; ++i) {
            std::cerr << "~";
        }
    }
 
    std::cerr << std::endl;

    if (!d.note.empty()) {
        std::cerr << "    " << "note: " << d.note << std::endl;
    }
}`,
        github: "https://github.com/anj0la/aera-lang",
    },
    {
        slug: "marsa",
        title: "MARSA",
        tags: ["Python", "NLP", "spaCy"],
        desc: "A lightweight assistant for aspect-sentiment pair extraction.",
        language: "python",
        code_snippet_title: "sentiment.py",
        code_snippet: `// sentiment.py
def _weighted_sentiment(self, bert_probs: list[float], vader_score: float) -> tuple[str, float]:
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
        return "neutral", final_confidence`,
        github: "https://github.com/anj0la/marsa",
    },
    {
        slug: "portfolio",
        title: "Portfolio",
        tags: ["TypeScript", "Next.js", "Tailwind"],
        desc: "An interactive terminal-based portfolio website.",
        language: "tsx",
        code_snippet_title: "blog-list.tsx",
        code_snippet: `// blog-list.tsx
const handleFilter = (query: string, type: "search" | "tag") => {
    if (!query) {
        resetFilter()
        return
    }

    if (type === "tag") {
        router.push(\`/blog?tag=$\{query.toLowerCase()}\`)
    } 
    else {
        router.push('/blog')
        const filtered = allPosts.filter((post) =>
            post.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPosts(filtered);
    }
}`,
        github: "https://github.com/anj0la/portfolio",
    },
    {
        slug: "moviesentiments",
        title: "MovieSentiments",
        tags: ["Python", "Streamlit", "Numpy"],
        desc: "IMDB reviews sentiment analysis via custom logistic regression.",
        language: "python",
        code_snippet_title: "predict.py",
        code_snippet: `// predict.py
def make_prediction(sentence: str) -> tuple[float, str]:
    vectorizer_path = 'moviesentiments/data/model/vectorizer.pkl'
    le_path = 'moviesentiments/data/model/le.pkl'
    
    # Load the trained vectorizer and label encoder    
    vectorizer = joblib.load(vectorizer_path)
    le = joblib.load(le_path)
    
    # Convert sentence to Dataframe for easier processing
    df = pd.DataFrame({'review': [sentence]})
    
    # Transform the review into a suitable input
    cleaned_sentence = clean_review(df)
    vectorized_sentence = vectorizer.transform(cleaned_sentence).toarray()  
    
    # Load the trained weights and bias for the model
    model = LogisticRegression()
    model.load_model()
    
    # Make a prediction
    logits = model.predict(vectorized_sentence)
    prediction = np.round(logits)
    prediction = prediction.astype(int).flatten()
    label = le.inverse_transform(prediction)
    
    return logits[0], label[0]`,
        github: "https://github.com/anj0la/MovieSentiments",
    },
]