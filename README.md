# b9labs-eth20
Tasks for the B9 Labs ETH Certified Course

## How to start development?
#### First Time?
1. `npm run install`
2. `npm run start`
3. Open your browser to `http://localhost:3000/` and make sure Ganache/Truffle Develop is running.
4. If it's your first time running this project, make sure the contracts have been compiled & migrated:

    ```
    $ truffle compile
    $ truffle migrate --network NETWORK_NAME_HERE
    ```

#### General
Best practice in development mode:
1. run `truffle compile` to make sure you're using the contract's latest version.
2. run `ruffle migrate --network NETWORK_NAME_HERE` before you begin.
3. If you're using MetaMask: Reset your account via settings.
4. As your contract has only recently been deployed, it won't show a video untill you request (a new) one.

## How to deploy?

If you want to deploy the project, you have to make sure you have an environment variable `$ETH_TV_SERVER_IP` set to the server's IP.

If you're using [oh-my-zsh terminal](https://ohmyz.sh/), you can add the variable in the `.zshrc` file

## How to run a private/dev/testnet?
You can use Truffle Develop or Ganache GUI.

## Common Issues
If you've been developing on & off for a while, you might encounter an error saying:
`Error: the tx doesn't have the correct nonce. account has nonce of: 0 tx has nonce of: x`

If this is the case, and you're using `MetaMask`, go to MetaMask settings and press 'Reset Account'.
