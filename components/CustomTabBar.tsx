import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming, Easing, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40;
const NUM_TABS = 4;
const TAB_WIDTH = TAB_BAR_WIDTH / NUM_TABS;
const CIRCLE_DIAMETER = 52; 

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const activeIndex = state.index;

  const animatedProps = useAnimatedProps(() => {
    const holeCenter = activeIndex * TAB_WIDTH + TAB_WIDTH / 2;
    const r = CIRCLE_DIAMETER / 1.3;
    const controlPointOffset = r * 1.1;

    const path = `
      M20,25
      H${holeCenter - r - 15}
      C${holeCenter - r},25 ${holeCenter - r},${r + 15} ${holeCenter},${r + 15}
      C${holeCenter + r},${r + 15} ${holeCenter + r},25 ${holeCenter + r + 15},25
      H${TAB_BAR_WIDTH - 20}
      C${TAB_BAR_WIDTH - 10},25 ${TAB_BAR_WIDTH},25 ${TAB_BAR_WIDTH},35
      V65
      C${TAB_BAR_WIDTH},75 ${TAB_BAR_WIDTH - 10},75 ${TAB_BAR_WIDTH - 20},75
      H20
      C10,75 0,75 0,65
      V35
      C0,25 10,25 20,25
      Z
    `;
    return { d: path };
  });

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(activeIndex * TAB_WIDTH, { duration: 350, easing: Easing.out(Easing.exp) }) },
      ],
    };
  });
  
  return (
    <View style={styles.tabBarContainer}>
      <Svg width={TAB_BAR_WIDTH} height={90} style={StyleSheet.absoluteFill}>
        <AnimatedPath animatedProps={animatedProps} fill="white" />
      </Svg>
      
      <Animated.View style={[styles.activeIndicatorContainer, animatedCircleStyle]}>
        <View style={styles.activeIndicator}>
          <FontAwesome
            name={descriptors[state.routes[activeIndex].key].options.tabBarIconName || 'question-circle'}
            size={24} 
            color="white"
          />
        </View>
      </Animated.View>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const iconName = options.tabBarIconName || 'question-circle';
        
        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            <Animated.View style={{ opacity: isFocused ? 0 : 1 }}>
              <FontAwesome name={iconName} size={22} color="#A0A0AA" />
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 65, 
    backgroundColor: 'transparent', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35, 
  },
  activeIndicatorContainer: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    alignItems: 'center',
  },
  activeIndicator: {
    width: CIRCLE_DIAMETER,
    height: CIRCLE_DIAMETER,
    borderRadius: CIRCLE_DIAMETER / 2,
    backgroundColor: '#FF6B6B',
    position: 'absolute',
    top: -5, 
    justifyContent: 'center',
    alignItems: 'center',    
  },
});

export default CustomTabBar;