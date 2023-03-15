# food-done-right

### [Demo](https://user-images.githubusercontent.com/47470038/225223787-21abd046-e01c-40dd-ab14-b7410511b821.mov)

## Development setup

- Make sure you have [docker](https://docs.docker.com/engine/install/), [docker-compose](https://docs.docker.com/compose/install/) and [docker-sync](https://docker-sync.readthedocs.io/en/latest/getting-started/installation.html)installed on your system.

- Create a new network (it it does not exist already)
    ```
    docker network create food_network
    ```

- Clone this repository and `cd` into it.

- Run the following command to start the file-sync between host and docker-container.
    ```
    docker-sync start
    ```

- Execute the following to build the backend.
    ```
    docker-compose build
    ```
    
- Start the composed Backend service
    ```
    docker-compose up
    ```

- Server will start on `localhost:8000`
