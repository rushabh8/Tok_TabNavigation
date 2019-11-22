import React, { Component } from 'react';
import { Platform, Image, ImageBackground, View, Dimensions, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { TabNavigator, TabBarBottom, NavigationActions, TabView } from 'react-navigation'
import Home from '../stackNavigation/homeStack';
import Awards from '../screens/selectAvatar';
import Sports from '../screens/gameComplete';
import Topics from '../stackNavigation/topicStack';
import Notifications from '../stackNavigation/notificationStack';

import { socket } from '../webService/global'
import webservice from '../webService/Api'
import styles from '../components/styles/styles'
import { scaleWidth, scaleHeight, normalizeFont } from '../components/common/Responsive';

const tabBackground = require("../image/Reset_Password/bottom_back.png")
const { width, height } = Dimensions.get('window');
const _tabBarOnPress = props => {
    return (
        alert('We are working on this !!')
    );
}
const HeaderLeft = ({ navigation, props }) => (
    <TouchableOpacity onPress={() => { navigation.navigate('Setting') }}
        style={{ flex: 2, justifyContent: 'flex-start', paddingTop: scaleHeight(10) }}>
        <Image source={require('../image/home/setting.png')} style={{ tintColor: 'white' }} />
    </TouchableOpacity>
);
const HeaderRight = ({ navigation, props }) => (
    <TouchableOpacity onPress={() => navigation.goBack(null)}
        style={{ flex: 2, justifyContent: 'flex-end', paddingBottom: scaleHeight(10), alignItems: 'flex-end' }}>
        <Image source={require('../image/home/chat.png')} style={{ tintColor: 'white' }} />
    </TouchableOpacity>
);
const HeaderBack = ({ navigation, props }) => (
    <TouchableOpacity onPress={() => navigation.goBack(null)}
        style={{ flex: 0.5, justifyContent: 'flex-start', paddingTop: scaleHeight(10) }}>
        <Image source={require('../image/BackIcon/back-icon.png')} style={{ tintColor: 'white' }} />
    </TouchableOpacity>
);

const Header = props => (
    <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: scaleHeight(8) }}>
        <Text style={{ color: 'white', fontSize: normalizeFont(22) }}>{props.title}</Text>
    </View>
);
const Footer = ({ navigation, props }) => (
    <View style={{ backgroundColor: 'white' }}>
        <View style={[styles.homeSearchView, { marginVertical: 10 }]}>

            <TextInput allowFontScaling={false}
                maxLength={100}
                placeholderTextColor="white"
                onEndEditing={() => navigation.navigate('SearchPlayerTopic')}
                underlineColorAndroid="transparent"
                style={styles.homeSearchText}
                placeholder="Search Player/Topic"
            />
            <View style={{ flex: 0.3 }}>
                <Image source={require('../image/create/search.png')} style={{ marginRight: 25 }} />
            </View>
        </View>
        <View style={{ backgroundColor: '#D00E17', width: width, height: 1, marginTop: 8 }}></View>
    </View>
);

const ImageHeader = props => {
    return (
        <ImageBackground
            style={{ width, height: Platform.OS == 'ios' ? 45 : 55, position: 'absolute', top: 0, left: 0 }}
            source={require("../image/Reset_Password/header.png")}
            resizeMode="cover"
        >
            <View style={{ height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                <Header {...props} style={{ backgroundColor: 'transparent' }} />
            </View>
        </ImageBackground>
    );
}

const ImageHeaderWithBack = props => {
    return (
        <ImageBackground
            style={{ width, height: Platform.OS == 'ios' ? 45 : 55, position: 'absolute', top: 0, left: 0 }}
            source={require("../image/Reset_Password/header.png")}
            resizeMode="cover"
        >
            <View style={{ paddingLeft: 10, flexDirection: 'row', height: 45, backgroundColor: 'transparent' }}>
                <HeaderBack {...props} style={{ backgroundColor: 'transparent' }} />
                <Header {...props} style={{ backgroundColor: 'transparent' }} />
            </View>

        </ImageBackground>


    );
}
const ImageHeaderHome = props => {
    return (
        <ImageBackground
            style={{ width, height: Platform.OS == 'ios' ? 45 : 55, position: 'absolute', top: 0, left: 0 }}
            source={require("../image/Reset_Password/header.png")}
            resizeMode="cover"
        >
            <View style={{ paddingHorizontal: 10, flexDirection: 'row', height: 45, backgroundColor: 'transparent' }}>
                <HeaderLeft {...props} style={{ backgroundColor: 'transparent' }} />
                <Header {...props} style={{ backgroundColor: 'transparent' }} />
                <HeaderRight {...props} style={{ backgroundColor: 'transparent' }} />
            </View>
            <Footer {...props} style={{ backgroundColor: 'transparent' }} />
        </ImageBackground>
    );
}
const FooterSelectTopic = ({ navigation, props }) => (
    <View style={{ backgroundColor: 'white' }}>
        <View style={styles.avatarSearchView}>
            <TextInput allowFontScaling={false}
                maxLength={100}
                placeholderTextColor="white"
                onEndEditing={() => navigation.navigate('SearchHistory')}
                underlineColorAndroid="transparent"
                style={[styles.homeSearchText, { borderRadius: 10, paddingLeft: 20, top: 5 }]}
                placeholder="Search Topics"
            />
            <TouchableOpacity style={{ right: 5, alignSelf: 'center', top: 5 }}>
                <Image source={require('../image/select_topic/done.png')} />
            </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#D2D2D2', width: width, height: 1, marginTop: 8 }}></View>
    </View>
);

let newNotification = false

class NotificationIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            newNotification: false,
            numOfNotification: 0
        }
    }

    componentDidMount() {
        socket.on('sendingFriendRequest', (data) => {
            this.setState({ newNotification: true })
            newNotification = true
            pressed = false
        })
        AsyncStorage.getItem('userId').then(userId => this.setState({ userId: JSON.parse(userId) }, () => this.Notifications()))
    }


    Notifications() {
        let variables = { "userId": this.state.userId }
        return webservice(variables, "users/ShowUserNotifications", "POST")
            .then(resp => {
                this.setState({ numOfNotification: resp.data.data.length })
            })
    }

    render() {
        return (
            <View style={{
                height: 15,
                width: 15,
                borderRadius: 7.5,
                position: 'absolute',
                backgroundColor: (this.state.newNotification || this.state.numOfNotification > 0) && !this.props.isFoucsed ? 'orange' : 'transparent',
                top: 2.5,
                left: 50,
                zIndex: 1
            }} />
        )
    }
}

let pressed = false

const TabNav = TabNavigator({

    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: " ",
            header: null,
            gesturesEnabled: false,
            tabBarOnPress: ({ scene, jumpToIndex }) => {
                const { route, focused, index } = scene;
                navigation.setParams({ searchKey: true });
                if (focused) {
                    if (route.index > 0) {
                        // eslint-disable-next-line immutable/no-let
                        let currentIndex = route.index;
                        while (currentIndex > 0) {
                            navigation.dispatch(NavigationActions.back({}));
                            currentIndex -= 1;
                        }
                    }
                } else {
                    jumpToIndex(index);
                }
            },
            tabBarIcon: ({ focused, tintColor }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: scaleWidth(17) }}>
                    <Image
                        source={focused ? require("../image/Reset_Password/qselected.png") : require("../image/Reset_Password/q.png")}
                    />
                </View>
            )
        })
    },


    Awards: {
        screen: Awards,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: " ",
            header: null,
            // header: (props) => <ImageHeader {...props} />,
            gesturesEnabled: false,
            tabBarOnPress: _tabBarOnPress,
            tabBarIcon: ({ focused, tintColor }) => (

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: scaleWidth(8) }}>
                    <Image
                        source={focused ? require("../image/Reset_Password/achievement_selected.png") : require("../image/Reset_Password/achievement.png")}
                    />
                </View>
            )
        })
    },

    Sports: {
        screen: Sports,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: " ",
            header: null,
            //header: (props) => <ImageHeader {...props} />,
            gesturesEnabled: false,
            tabBarOnPress: _tabBarOnPress,
            tabBarIcon: ({ focused, tintColor }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Image
                        source={focused ? require("../image/Reset_Password/file_selected.png") : require("../image/Reset_Password/save.png")}
                    />
                </View>
            )
        })
    },

    Topics: {
        screen: Topics,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: " ",
            tabBarVisible: false,
            gesturesEnabled: false,
            tabBarOnPress: ({ scene, jumpToIndex }) => {
                AsyncStorage.setItem('TabPressed', "yes").then((success) => {
                })
                const { route, focused, index } = scene;
                navigation.setParams({ searchKey: true });
                if (focused) {
                    if (route.index > 0) {
                        // eslint-disable-next-line immutable/no-let
                        let currentIndex = route.index;
                        while (currentIndex > 0) {
                            navigation.dispatch(NavigationActions.back({}));
                            currentIndex -= 1;
                        }
                    }
                } else {
                    jumpToIndex(index);
                }
            },
            tabBarIcon: ({ focused, tintColor }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: scaleWidth(7) }}>
                    <Image
                        source={focused ? require("../image/Reset_Password/menu_selected.png") : require("../image/Reset_Password/menu.png")}
                    />
                </View>
            )
        })
    },

    Notifications: {
        screen: Notifications,
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: " ",
            header: null,
            header: (props) => <ImageHeader {...props} title='Notifications' />,
            gesturesEnabled: false,
            tabBarOnPress: ({ scene, jumpToIndex }) => {
                newNotification = false
                pressed = true
                AsyncStorage.setItem('TabPressed', "yes")
                const { route, focused, index } = scene;
                navigation.setParams({ searchKey: true });
                if (focused) {
                    if (route.index > 0) {
                        // eslint-disable-next-line immutable/no-let
                        let currentIndex = route.index;
                        while (currentIndex > 0) {
                            navigation.dispatch(NavigationActions.back({}));
                            currentIndex -= 1;
                        }
                    }
                }
                else {
                    jumpToIndex(index);
                }
            },
            tabBarIcon: ({ focused, tintColor }) => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: scaleWidth(17) }}>
                        <NotificationIndicator
                            isFoucsed={pressed}
                        />
                        <Image source={focused ? require("../image/Reset_Password/notification2.png") : require("../image/Reset_Password/notification.png")} />
                    </View>
                )
            }
        })
    }
},
    {
        tabBarOptions: {
            lazyLoad: true,
            indicatorStyle: {
                backgroundColor: 'transparent'
            },
            showIcon: true,
            showLabel: false
        },

        tabBarComponent: props => {
            const { navigation, navigationState } = props;
            const _jumpToIndex = props.jumpToIndex; // Just in case 
            return (
                <ImageBackground style={{ width, height: Platform.OS == 'ios' ? scaleHeight(39) : scaleHeight(40) }} source={tabBackground}>
                    <TabBarBottom {...props}
                        jumpToIndex={(index) => {
                            tab = navigationState.routes[index];
                            tabRoute = tab.routeName;
                            firstRoute = tab.routes[0].routeName; // navState is Tabs object
                            const tabAction = NavigationActions.navigate({ routeName: tabRoute });
                            const firstScreenAction = NavigationActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: firstRoute })]
                            });
                            navigation.dispatch(tabAction);
                            navigation.dispatch(firstScreenAction);
                        }}
                        style={{ backgroundColor: 'transparent', bottom: 18, borderTopColor: 'transparent' }} />
                </ImageBackground>
            );
        },
        lazyLoad: true,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        gesturesEnabled: false,
        swipeEnabled: false,
        lazy: true
    }
);

export default TabNav;
