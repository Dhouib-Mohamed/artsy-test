/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {Image, Pressable, ScrollView, Text, TextInput, View,} from 'react-native';
import {Chase} from "react-native-animated-spinkit";
import getAppToken from "./getAppToken";

const App= () => {
    const [criteria,setCriteria] = useState('');
    const [searching,setSearching] = useState(false);
    const [artists,setArtists] = useState([])
    console.log(`artist ${artists}`)
        const fetchData = async () => {
        setSearching(true);
            const apiUrl = 'https://api.artsy.net/api/tokens/xapp_token';
            let xappToken;
            try {
                xappToken = await getAppToken(apiUrl);
            } catch (e) {
                console.error(e)
            }
            const traverson = require('traverson'),
                JsonHalAdapter = require('traverson-hal');

            traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
            const api = traverson.from(`https://api.artsy.net/api/artists${criteria===''?'':'/'+criteria}`).jsonHal();

            await api.newRequest()
                .withRequestOptions({
                    headers: {
                        'X-Xapp-Token': xappToken,
                        'Accept': 'application/vnd.artsy-v2+json'
                    }
                })
                .getResource(function (error, data={}) {
                    console.log(data)
                    if ('_embedded' in data) {
                        setArtists(data['_embedded']['artists']);
                    }
                    else if ('name' in data){
                        setArtists([data]);
                    }
                    else {
                        setArtists([])
                    }
                });
        }

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom:10,
            }}>
                <TextInput
                    style={{
                        height: 44,
                        width: 250,
                        margin: 12,
                        borderWidth: 1,
                        padding: 10,
                        borderRadius:10,
                    }
                    }
                    onChangeText={setCriteria}
                    value={criteria}
                />
                <Pressable
                    style={{
                        marginVertical:30,
                        marginHorizontal:10,
                        backgroundColor: "rgba(182,71,71,0.91)",
                        width: 90,
                        height: 44,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 40,
                    }}
                    onPress={()=>{
                        fetchData().then(r => setSearching(false)).catch(console.error);
                    }}
                >
                    <Text
                        style={{
                            color:"#fff",
                        }}
                    >
                        Search
                    </Text>
                </Pressable>
            </View>
            {searching ?
                <View style={{
                    alignItems:'center',
                    alignContent:'center',
                }}>
                    <Chase />
                </View>
                : artists.length === 0 ?
                    <View
                    style={{
                        alignItems:'center',
                        padding:15,
                    }}>
                        <Text style={{fontSize:18}}> No Artists exists </Text>
                    </View> :
                        <ScrollView>
                            {artists.map((artist) =>{
                                    return(
                                        <View style={{
                                            backgroundColor:"rgba(138,69,69,0.64)",
                                            marginVertical:10,
                                            marginHorizontal:15,
                                            height:500,
                                            borderWidth:2,
                                            borderRadius:20,
                                            flexDirection:"column"
                                        }}>
                                            <View key = {artist.id} style={{
                                                marginVertical:4,
                                                flexDirection:'row'
                                            }}>
                                                <Image source={{uri: ('thumbnail' in artist['_links'])?artist['_links']['thumbnail']['href']:"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}} style={{width:110,height:110,marginHorizontal:10,alignSelf:'center'}}/>
                                                <View style={{
                                                    flexDirection:'column',
                                                }}>
                                                    <Text>Name: {artist.name}</Text>
                                                    <Text>Gender: {artist.gender}</Text>
                                                    <Text>Nationality: {artist.nationality}</Text>
                                                    <Text>Born on {artist.birthday} in {artist.hometown}</Text>
                                                    <Text>Died on {artist.deathDay}</Text>
                                                    <Text>Lived in {artist.location}</Text>
                                                </View>
                                            </View>
                                            <ScrollView style={{height:380}}>
                                                <Text style={{margin:6}}>Biography: {artist.biography}</Text>
                                            </ScrollView>
                                        </View>
                                    );
                            })}
                        </ScrollView>

                }
        </View>
    )
}


export default App;
