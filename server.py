from gemeaux import App, StaticHandler

if __name__ == "__main__":
    urls = {
        "": StaticHandler(
            static_dir="/Users/mayakarabula/Documents/repositories/mysite-notion/gemini/"
        ),
    }
    app = App(urls)
    app.run()