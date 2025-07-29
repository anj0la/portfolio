import { type BlogPost } from "../../blog-post-interface";

export const aeraBlogPost: BlogPost = {
    slug: "aera",
    title: "Aera",
    publishedAt: "2025-07-26",
    updatedAt: "2025-07-29",
    readingTime: "14",
    summary: "A programming language designed for interactive applications, built from scratch with a focus on performance, composition over inheritance, developer-friendly syntax and control.",
    tags: ["C++", "CMake", "Programming Languages"],
    sections: [
        {
            type: "heading",
            content: "Context"
        },
        {
            type: "text",
            content: "The idea of Aera came to me while I was working on Penguin 2D, the predecessor to Penguin Framework. Creating the framework and building games with C++ was challenging. The lack of good generics meant I had to wrestle with messy templates. C++ also supports multiple inheritance, which made it harder to use composition and dragged me into the usual object-oriented issues. The syntax was verbose, which made my development slow."
        },
        {
            type: "text",
            content: "While C++ gave me performance and control, it also made development feel more error-prone and frustrating than it really needed to be. That experience got me thinking about what a language built specifically for interactive applications might look like."
        },
        {
            type: "text",
            content: "At the same time, I'd been interested in programming language design and theory throughout university, taking courses like Programming Languages and learning about finite automata and context-free grammars. So starting Aera felt like a natural way to dive deeper while also standing out when applying to grad school."
        },
        {
            type: "text",
            content: "Aera aims to be performant, flexible with ad-hoc polymorphism to support composition over inheritance, more usable, with simpler, more readable syntax and the control needed to build and run interactive applications fast."
        },
        {
            type: "heading",
            content: "Technical Approach"
        },
        {
            type: "heading2",
            content: "Language Design"
        },
        {
            type: "text",
            content: "I designed Aera's syntax to be clean and familiar while avoiding C++'s complexity. The language supports modern features like traits for composition, optional types, and a simplified module system."
        },
        {
            type: "text",
            content: "Here's what a basic Aera program looks like:"
        },
        {
            type: "code",
            language: "aera",
            code: `# Function declaration with optional return type
fn add(x: int32, y: int32) -> int32 {
    return x + y;
}

# Regular struct
struct Player {
    name: string;
    position: Point;
}

# Struct with default field values
struct Point {
    x: float32 = 0.0;
    y: float32 = 0.0;
}

# Traits enable composition
trait Movable {
    modifies fn move(dx: float32, dy: float32) -> None;  
}

# Implement trait for Player struct
with Moveable for Player {
    fn move(dx: float32, dy: float32) -> None {
        self.position.x += dx;
        self.position.y += dy;
    }
}`
        },
        {
            type: "heading2",
            content: "Grammar Notation"
        },
        {
            type: "text",
            content: "I defined Aera's syntax using a simplified EBNF-like notation where quotes denote terminal strings, \"|\" denotes choices, \";\" terminates rules, \"[item]\" means optional, \"{item}\" means zero or more repetitions, and spaces indicate concatenation."
        },
        {
            type: "text",
            content: "Here's how I defined expressions with operator precedence:"
        },
        {
            type: "code",
            language: "ebnf",
            code: `expression = assignment ;

assignment = expression assignment_op assignment | conditional ;
assignment_op = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | "&=" | "|=" | "^=" | "~=" ;  

conditional = logical_or ["if" expression "else" else conditional] ;
logical_or = logical_and { "||" logical_and } ;
logical_and = bitwise_or { "&&" bitwise_or } ;
bitwise_or = bitwise_xor { "|" bitwise_xor } ;
bitwise_xor = bitwise_and { "^" bitwise_and } ;
bitwise_and = equality { "&" equality } ;
equality = comparison { ("==" | "!="), comparison } ;
comparison = shift { (">" | ">=" | "<" | "<=") shift } ;
shift = term { (">>" | "<<") term } ;
term = factor { ("+" | "-") factor } ;
factor = unary { ("*" | "/" | "%") unary } ;

unary = ("!" | "-"| "~" | "&" ) unary | postfix ;
postfix = primary { ("[" expression "]" | "." identifier | "(" [argument_list] ")"  | "?" ) } ;
primary = literal | identifier | "(" expression ")" ;

argument_list = expression { ","  expression } ;`
        },
        {
            type: "text",
            content: "And here's how I structured declarations to support the composition-focused design:"
        },
        {
            type: "code",
            language: "ebnf",
            code: `declaration = function_declaration
            | variable_declaration
            | const_declaration
            | struct_declaration 
            | class_declaration
            | trait_declaration 
            | with_declaration ;

function_declaration = [modifiers] "fn" identifier "(" [parameter_list] ")" ["->", type], block ;  
parameter_list = parameter { "," parameter } ;
parameter = identifier ":" type ;
modifiers = "pub" | "modifies" ;

variable_declaration = "let" ["mut"] identifier [":" type] ["=" expression ";"] ;
const_declaration = "const" identifier [":" type] "=" expression ";" ;

struct_declaration = "struct" identifier "{" { field_declaration } "}" ;
field_declaration = identifier ":" type [ "=" expression ] ";" ;

class_declaration = "class" identifier [":" identifier] "{" { class_body } "}" ;
class_body = { class_member } ;
class_member = field_declaration | function_declaration ;

trait_declaration = "trait" identifier "{" { function_declaration } "}" ;
with_declaration = "with" identifier "for" identifier "{" { function_declaration } "}" ;`
        },
        {
            type: "heading",
            content: "Implementation"
        },
        {
            type: "heading2",
            content: "Lexer"
        },
        {
            type: "text",
            content: "I built a basic lexer capable of recognizing characters, strings, integer and floating point numbers with or without suffixes. The main tokenization logic handles different character types:"
        },
        {
            type: "code",
            language: "cpp",
            code: `void Lexer::read_token() {
    char ch = advance();
        
    switch (ch) {
        // Punctuation
        case '(': case ')': case '{': case '}':
        case ',': case ';': case ':': read_punctuation(ch); break;  

        // Operators
        case '+': case '-': case '*': case '/':
        case '=': case '!': case '<': case '>':
        case '&': case '|': case '%': case '^':
        case '.': case '?': case '@': read_operator(ch); break;

        // Line comments
        case '#': read_line_comment(); break;

        // Ignore whitespace
        case ' ': case '\\r': case '\\t': case '\\n': break;

        // Literals
        case '\\'': read_character(); break;
        case '"': read_string(); break;

        // Numbers and identifiers
        default:
            if (is_digit(ch)) {
                read_number(); 
            }
            else if (is_alpha(ch)) {
                read_identifier();
            }
            else {
                had_error = true;
                std::string bad_char(1, ch);
                add_token(TokenType::Illegal, bad_char);
            }
            break;
        }
}`
        },
        {
            type: "heading2",
            content: "Abstract Syntax Tree"
        },
        {
            type: "text",
            content: "I designed the AST using the visitor pattern, which allows me to add new functionality (like type checking, code generation, or optimization passes) without changing the AST node definitions:"
        },
        {
            type: "code",
            language: "cpp",
            code: `struct DeclVisitor {
    virtual ~DeclVisitor() = default;

    virtual Result visit_fn_decl(const FnDecl& decl) = 0;
    virtual Result visit_var_decl(const VarDecl& decl) = 0;
    virtual Result visit_const_decl(const constDecl& decl) = 0;  
    virtual Result visit_struct_decl(const StructDecl& decl) = 0;
    virtual Result visit_class_decl(const ClassDecl& decl) = 0;
    virtual Result visit_field_decl(const FieldDecl& decl) = 0;
    virtual Result visit_trait_decl(const TraitDecl& decl) = 0;
    virtual Result visit_with_decl(const WithDecl& decl) = 0;
};

struct StructDecl : Decl {
    Token name;
    std::vector<std::unique_ptr<FieldDecl>> fdecls;

    Result accept(DeclVisitor& visitor) const override {
        return visitor.visit_struct_decl(*this);
    }
};

struct FieldDecl : Decl {
    Token name;
    Type type;
    std::unique_ptr<Expr> initializer;

    Result accept(DeclVisitor& visitor) const override {
        return visitor.visit_field_decl(*this);
    }
};`
        },
        {
            type: "heading2",
            content: "Parser"
        },
        {
            type: "text",
            content: "I built a handwritten recursive descent parser that translates the grammar rules directly into C++ functions. It was quite straightforward since I could translate my grammar into corresponding functions:"
        },
        {
            type: "code",
            language: "cpp",
            code: `std::unique_ptr<Expr> Parser::conditional() {
    auto expr = logical_or();

    if (match(TokenType::If)) { 
        auto condition = expression(); 
        consume(TokenType::Else, "Expected 'else' after conditional expression");  
        auto else_expr = conditional();

        return std::make_unique<Conditional>(std::move(expr),
            std::move(condition),
            std::move(else_expr));
    }
    return expr;
}`
        },
        {
            type: "heading2",
            content: "Error Diagnostics"
        },
        {
            type: "text",
            content: "I'm currently working on error diagnostics. I created a Diagnostic struct that stores information about errors, warnings, and notes:"
        },
        {
            type: "code",
            language: "cpp",
            code: `struct Diagnostic {
    enum class Severity { Error, Warning, Note };  
    Severity severity;
    int token_length;
    std::string filepath;
    SourceLocation loc;      
    std::string message;     
    std::string source_line; 
    std::string note;      
    };`
        },
        {
            type: "text",
            content: "The diagnostic reporter can collect multiple errors and print them with helpful information, including source line highlighting and caret positioning, showing exactly where the error occurred."
        },
        {
            type: "heading",
            content: "Learning"
        },
        {
            type: "text",
            content: "Honestly, it's been so much fun learning about how to implement my own programming language. Aera is a long-term project and goal of mine, and as I keep working on it, I know I’ll keep learning a lot more about programming language theory along the way."
        },
        {
            type: "heading",
            content: "Next Steps"
        },
        {
            type: "text",
            content: "I'm currently reworking the lexer to store literal values in the token, so that parsing literals becomes easier. I also need to add my new diagnostic reporter to replace my very simple and limited error system in my lexer and parser. Once I'm done, I'll start learning how to build a type checker and from there, I'll be one step closer to compiling Aera and running Aera code."
        }
    ],
    github: "https://github.com/anj0la/aera-lang"
};
