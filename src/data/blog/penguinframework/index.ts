import { type BlogPost } from "@/data/blog-post-interface";

export const penguinFrameworkBlogPost: BlogPost = {
    slug: "penguinframework",
    title: "Penguin Framework",
    publishedAt: "2025-07-26",
    updatedAt: "2025-08-19",
    readingTime: "12",
    summary: "A MonoGame-like framework for C++ to create fun and adorable 2D games, built with SDL and designed for flexibility and ease of use.",
    tags: ["C++", "SDL", "CMake"],
    sections: [
        {
            type: "heading",
            content: "Context"
        },
        {
            type: "text",
            content: "Penguin Framework is a MonoGame-like framework for C++, to create fun and adorable 2D games. It uses SDL under the hood for rendering capabilities, and provides me with the flexibility needed to tailor the framework to my own needs."
        },
        {
            type: "text",
            content: "Penguin Framework started as Penguin 2D, a much simpler and less ambitious project. With it, I was able to create a Pong game, but quickly saw the limitations in my library design."
        },
        {
            type: "text",
            content: "So, I started fresh and redesigned the entire architecture. I improved the export constructs from Penguin 2D and added completely new features like sprite rendering, window management and custom events."
        },
        {
            type: "heading",
            content: "Technical Approach"
        },
        {
            type: "heading2",
            content: "PIMPL Pattern Implementation"
        },
        {
            type: "text",
            content: "Penguin Framework uses the PIMPL (Pointer to Implementation) approach to hide implementation details. This means that end-users don't need to install the dependencies themselves. Penguin Framework handles it in its own CMake file, fetching the dependencies and linking to them privately."
        },
        {
            type: "code",
            language: "cpp",
            code: `namespace penguin::internal::rendering::primitives {
        // Forward declaration
        struct TextureImpl;
    }

    namespace penguin::rendering::primitives {
        class PENGUIN_API Texture {
        public:
            Texture(NativeRendererPtr renderer_ptr, const char* path);
            ~Texture();

            Texture(Texture&&) noexcept;
            Texture& operator=(Texture&&) noexcept;

            // Validity checking
            [[nodiscard]] bool is_valid() const noexcept;
            [[nodiscard]] explicit operator bool() const noexcept;

            NativeTexturePtr get_native_ptr() const;
            penguin::math::Vector2i get_size() const;

        private:
            std::unique_ptr<penguin::internal::rendering::primitives::TextureImpl> pimpl_;  
        };
    }`
        },
        {
            type: "text",
            content: "This also allows me to use C++ standard libraries freely in the implementation files while keeping the public API simple. This keeps my public API clean and dependency-free."
        },
        {
            type: "heading2",
            content: "Opaque Pointer System"
        },
        {
            type: "text",
            content: "To keep my dependencies hidden, I used opaque pointers to represent them. It works by casting internal SDL pointers to void* in the implementation, then other classes can get these pointers and cast them back to their original types when needed. Instead of using raw void* everywhere, I created aliases for better readability:"
        },
        {
            type: "code",
            language: "cpp",
            code: `struct NativePtr {
        void* ptr;

        explicit NativePtr(void* p) : ptr(p) {}  

        template <typename T>
        T* as() const {
            return static_cast<T*>(ptr);
        }
    };

    using NativeWindowPtr = NativePtr;
    using NativeRendererPtr = NativePtr;
    using NativeTexturePtr = NativePtr;
    using NativeTextContextPtr = NativePtr;
    using NativeTextPtr = NativePtr;
    using NativeFontPtr = NativePtr;`
        },
        {
            type: "text",
            content: "Penguin Framework can be built as a static or dynamic library, offering flexibility for game developers."
        },
        {
            type: "heading",
            content: "Implementation"
        },
        {
            type: "heading2",
            content: "Extensive Logging System"
        },
        {
            type: "text",
            content: "One of the things I’m most proud of in Penguin Framework is the logging system. I was getting really tired of not knowing why my code wasn’t working in certain test cases, so I built a logger class along with some macros to make things more convenient. It’s made tracking down bugs so much easier:"
        },
        {
            type: "code",
            language: "cpp",
            code: `#define PF_LOG_DEBUG(msg) penguin::log::Logger::get_instance().debug(msg)
#define PF_LOG_INFO(msg) penguin::log::Logger::get_instance().info(msg)
#define PF_LOG_WARNING(msg) penguin::log::Logger::get_instance().warning(msg)  
#define PF_LOG_ERROR(msg) penguin::log::Logger::get_instance().error(msg)`
        },
        {
            type: "text",
            content: "I added error, warning and debug messages throughout all of my .cpp files. If an illegal operation happened, it would be printed to the console to inform the user. If for some reason some object wasn't initialized, an error would be written to the console, along with the exact location of the error."
        },
        {
            type: "text",
            content: "I also added functionality to write these logs to a .log file so that users can look through the log if issues occurred."
        },
        {
            type: "heading2",
            content: "Comprehensive Testing"
        },
        {
            type: "text",
            content: "I’ve also put a lot of effort into testing Penguin Framework. Every time I add a new feature, I write tests for it. These tests have actually caught bugs in the source code that I probably wouldn’t have noticed until much later. Back when I was working on Penguin 2D, I’d only catch these issues after running the program. Now, I can catch them early through automated testing. Right now, I'm maintaining 384 passing tests"
        },
        {
            type: "code",
            language: "cpp",
            code: `TEST_F(WindowTestFixture, Constructor_Creates_HiddenWindow) {
    // Arrange & Act (Implicit via constructor)
    const char* expected_title = "Test Window";
   const Vector2i expected_size(640, 480);
    // Assert
    EXPECT_TRUE(window_ptr->is_valid());
    EXPECT_TRUE(*window_ptr); // testing bool() operator
    EXPECT_STREQ(window_ptr->get_title(), expected_title);
    EXPECT_EQ(window_ptr->get_width(), expected_size.x);
    EXPECT_EQ(window_ptr->get_height(), expected_size.y); 
    EXPECT_TRUE(window_ptr->is_hidden()); 
    EXPECT_TRUE(window_ptr->is_open());   
    EXPECT_TRUE(window_ptr->is_resizable());
    EXPECT_TRUE(window_ptr->is_bordered()); // Default is bordered unless Borderless flag is set  
    EXPECT_FALSE(window_ptr->is_always_on_top());
    EXPECT_FALSE(window_ptr->is_focused());
    EXPECT_FALSE(window_ptr->is_fullscreen());
    EXPECT_FALSE(window_ptr->is_maximized());
    EXPECT_FALSE(window_ptr->is_minimized());
    EXPECT_FALSE(window_ptr->is_mouse_grabbed());
}`
        },
        {
            type: "heading2",
            content: "Incremental Development Approach"
        },
        {
            type: "text",
            content: "Penguin Framework taught me how powerful the divide and conquer approach is for managing complex projects. Instead of tackling the entire 2D game framework at once, I broke it down into fundamental building blocks, starting with basic Vector and Colour classes, then progressively building up through Window, rendering system, sprite system, and text system, each component building on the previous ones. By splitting this complex project into smaller subprojects, I was able to make steady progress and create a solid framework."
        },
        {
            type: "heading",
            content: "Learning"
        },
        {
            type: "text",
            content: "Logging and tests saved me hours of debugging. Whenever my tests fail, I can read the logs and see exactly which line of code in which file is causing the error. This has made Penguin Framework a blast to create."
        },
        {
            type: "text",
            content: "I've also learned through Penguin Framework how to manage complex projects. The PIMPL pattern and opaque pointers kept my public API clean while hiding SDL dependencies. The incremental development approach, starting with basic math classes and building up layer by layer, helped me to tackle for such an ambitious project."
        },
        {
            type: "text",
            content: "Most importantly, I learned that good tooling is just as important as the actual framework code. Logging and testing made debugging less of a guessing game and more fun."
        },
        {
            type: "heading",
            content: "Next Steps"
        },
        {
            type: "text",
            content: "I'm currently designing and planning out the events system. I had worked on it back in April, but wanted to get the rendering system completed first. After the events system is done, I'll be able to work on some smaller systems before creating the game class and officially creating games with the framework! If SDL releases a 3.0 version of SDL_mixer, then I'll go ahead and work on audio after the events system."
        }
    ],
    github: "https://github.com/anj0la/penguin_framework"
};