/*
 * Copyright (c) 2021-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Button, Header, Icon, Image } from 'semantic-ui-react';
import config from './config';
import { Link } from 'react-router-dom';
import randomColor from 'randomcolor';

const mockerSupportedScopes = [
  'appliance', 'app', 'bank', 'beer', 'blood', 'invoice',
  'coffee', 'commerce', 'company', 'computer', 'crypto',
  'color', 'dessert', 'device', 'food', 'restaurant', 'subscription'
];

const iconsMap = {
  app: 'app store ios',
  appliance: 'medapps',
  bank: 'money bill alternate',
  beer: 'beer',
  blood: 'medkit',
  coffee: 'coffee',
  color: 'tint',
  commerce: 'shopping cart',
  company: 'building',
  computer: 'computer',
  crypto: 'bitcoin',
  dessert: 'birthday cake',
  device: 'mobile',
  food: 'food',
  invoice: 'file alternate',
  restaurant: 'food',
  subscription: 'payment',
};

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async (addedScopes) => {
    const scopes = [...config.oidc.scopes, ...addedScopes]
    await oktaAuth.signInWithRedirect({
      scopes
    });
  };

  if (!authState) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div>
        {
          authState.isAuthenticated && (
            <div className="Celebrate-center">
              <div className="image Margin-bottom-25">
                <Header as="h1">Successfully Enriched Identity Token!</Header>
                <Image className='Celebrate-center-photo' size="large" src="/celebrate.svg" />
              </div>
              <div className="Margin-top-25">
                Go to <Link to="/profile">Profile</Link> to view the enriched claims.
              </div>
            </div>
          )
        }
        <p></p>
        { authState.isAuthenticated && !userInfo
        && <div>Loading user information...</div>}

        {!authState.isAuthenticated  
        && (
        <div>
          <Header as="h1">Token Inline Hooks</Header>
          <p>
            Okta's inline token hooks allow you to enrich your JWT in real-time at the time of JWT minting. 
            As a result, these hooks can provide secure means of adding data that may not reside within Okta or require complex queries.
          </p>
          <h2>Enrich Your Identity Token</h2>
          <h4>Real-Time, Contextual Information</h4>
          <Button id="login-weather" secondary onClick={() => login(["weather"])}>
            <Icon name="sun"/>
            My Weather
          </Button>
          <h4>Typical Use Cases: Preferences, Details, etc</h4>
          { 
            mockerSupportedScopes.map((scope, index) => (
                <Button className="Home-btn" id={`login-${scope}`} onClick={() => login([scope])}>
                  <Icon name={iconsMap[scope]}/>
                  {`${scope.charAt(0).toUpperCase()}${scope.substring(1, scope.length)}`}
                </Button>
            ))
          }
        </div>
        )}
      </div>
    </div>
  );
};

export default Home;
