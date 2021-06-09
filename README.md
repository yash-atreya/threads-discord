<h1 align="center">threads-discord-bot</h1>

<div align="center">

<i>Discord bot for the incredible [threads_reader app](https://threads-web.vercel.app)</i>

</div>

## Bot Commands

<i>All commands should begin with "~", which is the prefix for the bot</i>

- recent

    Gives you the most recent threads the bot has collected from twitter

    ```sh
    # num: integer - number of threads you wish to retrieve
    ~recent num
    ```
    
    Reply:
    
    <img src="./images/recent_reply.png" width="100%" height="100%">

- categories

    Lists the categories available to read from

    ```sh
    ~categories
    ```
    Reply:

    <img src="./images/categories_reply.png" width="100%" height="100%">

- category

    Get threads from a paritcular category

    ```sh
    # num: integer - number of threads you wish to retrieve
    ~category category num
    # category: one of - 
    # 1. books-and-articles
    # 2. business
    # 3. current-affairs
    # 4. health
    # 5. life
    # 6. personal-growth
    # 7. programming
    # 8. startups
    # 9. technology
    ```

    Reply:

    <img src="./images/category_reply.png" width="100%" height="100%">

- search

    Search for a particular thread

    ```sh
    # num: integer - number of threads you wish to retrieve
    # query: string - your search query
    ~search query num
    ```

    Reply:

    <img src="./images/search_reply.png" width="100%" height="100%">
