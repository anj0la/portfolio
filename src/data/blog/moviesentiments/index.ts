import { type BlogPost } from "@/data/blog-post-interface";

export const movieSentimentsBlogPost: BlogPost = {
    slug: "moviesentiments",
    title: "MovieSentiments",
    publishedAt: "2025-07-26",
    updatedAt: "2025-07-29",
    readingTime: "8",
    tags: ["Python", "Streamlit", "Numpy"],
    summary: "MovieSentiments is a project designed to analyze IMDB movie reviews using a custom-built Logistic Regression model.",
    sections: [
        {
            type: "heading",
            content: "Context"
        },
        {
            type: "text",
            content: "MovieSentiments is a project I built to analyze IMDB movie reviews using a custom logistic regression model. Instead of using libraries like PyTorch or TensorFlow that handle everything automatically, I implemented the core parts myself, including loss computation, backpropagation, and weight updates."
        },
        {
            type: "text",
            content: "This project actually started from an assignment in my AI course where I was tasked with creating a simple logistic regression model with randomly generated input data and training it to 100% accuracy. I went a bit further and used Matplotlib to generate plots during training so I could see how the model was performing over multiple epochs."
        },
        {
            type: "text",
            content: "In October 2024, I decided I wanted to improve this assignment with the knowledge I'd gained from working on other AI models. I also wanted a finished project that I could put on my resume and actually be proud of. So I gave myself one month to turn this assignment into a real project."
        },
        {
            type: "heading",
            content: "Technical Approach"
        },
        {
            type: "heading2",
            content: "The Model Architecture"
        },
        {
            type: "text",
            content: "I expanded the original logistic regression model significantly. I kept the sigmoid activation function from the assignment, but added:"
        },
        {
            type: "list",
            items: [
                "Mini-batch training instead of processing everything at once",
                "L2 regularization to prevent the model from getting too attached to specific words",
                "Early stopping so training would halt if the validation loss stopped improving (i.e., avoid overfitting)",
                "Cross-entropy loss with clipping to avoid mathematical issues (like taking log of 0)"
            ]
        },
        {
            type: "code",
            language: "python",
            code: `def _loss_function(self, y: np.ndarray, y_hat: np.ndarray) -> float:
    # Clip y_hat to avoid log(0)
    y_hat = np.clip(y_hat, 1e-10, 1 - 1e-10)
    m = y.shape[0]
        
    cross_entropy_loss = -(1 / m) * np.sum(y * np.log(y_hat) + (1 - y) * np.log(1 - y_hat))  
    l2_reg = (self.reg_lambda / (2 * m)) * np.sum(np.square(self.weights))
    return cross_entropy_loss + l2_reg`
        },
        {
            type: "code",
            language: "python",
            code: `class EarlyStopper:
    def __init__(self, patience: int = 1, min_delta: int = 0):
        self.patience = patience
        self.min_delta = min_delta
        self.counter = 0
        self.min_validation_loss = float('inf')

    def early_stop(self, validation_loss: float) -> bool:
        if validation_loss < self.min_validation_loss:
            self.min_validation_loss = validation_loss
            self.counter = 0
        elif validation_loss > (self.min_validation_loss + self.min_delta):  
            self.counter += 1
            if self.counter >= self.patience:
                return True
        return False`
        },
        {
            type: "heading2",
            content: "Data Processing Pipeline"
        },
        {
            type: "text",
            content: "I also built a data preprocessing pipeline to handle the uncleaned movie review text:"
        },
        {
            type: "list",
            items: [
                "Custom text cleaning function to remove URLs, emails, convert emojis to text and remove stop words",
                "TfidfVectorizer to convert the actual text into numerical features the model could work with",
                "LabelEncoder for the positive/negative classifications",
                "scikit-learn's train_test_split for training and testing sets"
            ]
        },
        {
            type: "code",
            language: "python",
            code: `def clean_review(df: pd.DataFrame) -> np.ndarray:
    if 'review' not in df.columns:
        raise ValueError('Expected column "review" in input file.')
    data = df['review']
        
    data = data.str.lower()
    data = data.apply(lambda x: x.encode('ascii', 'ignore').decode('ascii'))
        
    data = data.replace(r'[^\w\s]', '', regex=True)
    data = data.replace(r'http\S+|www\.\S+', '', regex=True)
    data = data.replace(r'\w+@\w+\.com', '', regex=True)
        
    data = data.apply(lambda x: emoji.demojize(x))
    data = data.replace(r':(.*?):', '', regex=True)
        
    stop_words = set(stopwords.words('english'))
    data = data.apply(lambda sentence: ' '.join(WordNetLemmatizer().lemmatize(word) \\  
        for word in sentence.split() if word not in stop_words))  
        
    return data`
        },
        {
            type: "text",
            content: "I saved the vectorizer and encoder objects so I could use them later when making predictions on new reviews."
        },
        {
            type: "heading",
            content: "Implementation"
        },
        {
            type: "text",
            content: "The implementation process taught me a lot about the challenges of training neural networks from scratch:"
        },
        {
            type: "list",
            items: [
                "Smaller batches (32-64) gave much more stable training compared to larger batches",
                "Runs over 100 epochs consistently gave better results than shorter runs under 100 epochs",
                "A larger learning rate (0.1) actually produced better training and testing performance than smaller values I tried",
                "The early stopping mechanism prevented overfitting and saved significant training time"
            ]
        },
        {
            type: "text",
            content: "I also implemented mini-batch gradient descent with weight updates:"
        },
        {
            type: "code",
            language: "python",
            code: `def _update_weights(self, X: np.ndarray, y: np.ndarray, y_hat: np.ndarray) -> None:  
    m = X.shape[0]
    d_weight = (1 / m) * np.dot(X.T, (y_hat - y))
    d_bias = (1 / m) * np.sum(y_hat - y)
    self.weights -= self.lr * d_weight
    self.bias -= self.lr * d_bias`
        },
        {
            type: "heading",
            content: "Outcomes"
        },
        {
            type: "text",
            content: "The final model achieved around 87% accuracy on the test set, which I was pretty happy with for a from-scratch implementation. More importantly, this project gave me deep insights into how machine learning models actually work under the hood."
        },
        {
            type: "text",
            content: "From my experimentation, I learned that batch size, learning rate, and training duration all significantly impact performance in ways I didn't expect. I thought that a smaller learning rate would result in higher accuracy, but it didn't. I also got to see firsthand how different lambda values affected overfitting vs underfitting."
        },
        {
            type: "text",
            content: "The final model can classify movie reviews as positive or negative with decent accuracy, and since I built it myself, I can actually understand and explain what it's doing. You can examine which words and phrases most influence the positive vs negative predictions, which is pretty cool."
        },
        {
            type: "text",
            content: "More importantly, this project gave me something I could point to and say \"I built this myself, from the ground up.\" You can check out the complete code on GitHub if you want to see how everything fits together!"
        }
    ],
    github: "https://github.com/anj0la/MovieSentiments"
};