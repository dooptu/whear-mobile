import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const Icon = MaterialCommunityIcons;

import { useAppTheme } from '../../hooks/useAppTheme';
import { AppText, BottomNavigationBar, Avatar } from '../../components';
import { GradientBackground } from '../../components';
import { MainStackParamList } from '../../navigation/types';
import { ROUTES, TAB_ROUTES } from '../../constants/routes';
import { spacing as spacingConstants } from '../../constants/theme';
import { useAuthStore } from '../../features/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Mock Data Types
interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUri: string;
  isViewed: boolean;
  isMyStory: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUri: string;
  caption: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  shares: number;
}

// Mock Data
const mockStories: Story[] = [
  {
    id: 's1',
    userId: 'u1',
    userName: 'You',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&h=1200&fit=crop',
    isViewed: false,
    isMyStory: true,
  },
  {
    id: 's2',
    userId: 'u2',
    userName: 'fashion_lover',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop',
    isViewed: false,
    isMyStory: false,
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'style_daily',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975732144-442d66dffb6e?w=800&h=1200&fit=crop',
    isViewed: true,
    isMyStory: false,
  },
  {
    id: 's4',
    userId: 'u4',
    userName: 'outfit_queen',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975867722-01286f6abf7d?w=800&h=1200&fit=crop',
    isViewed: false,
    isMyStory: false,
  },
  {
    id: 's5',
    userId: 'u5',
    userName: 'trend_setter',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975747456-4097f9c2a5c2?w=800&h=1200&fit=crop',
    isViewed: true,
    isMyStory: false,
  },
];

const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    userName: 'fashion_lover',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1200&fit=crop',
    caption: 'Love this casual office look! Perfect for a Monday morning ☕️ #officewear #fashion',
    timestamp: '2h ago',
    likes: 124,
    isLiked: false,
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'style_daily',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
        text: 'So elegant! Where did you get the blazer?',
        timestamp: '1h ago',
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: 'r1',
            userId: 'u2',
            userName: 'fashion_lover',
            userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            text: 'Thanks! It\'s from Zara, got it last week 😊',
            timestamp: '45m ago',
            likes: 5,
            isLiked: false,
          },
        ],
      },
      {
        id: 'c2',
        userId: 'u4',
        userName: 'outfit_queen',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
        text: 'Absolutely stunning! 🔥',
        timestamp: '30m ago',
        likes: 8,
        isLiked: true,
      },
    ],
    shares: 23,
  },
  {
    id: 'p2',
    userId: 'u3',
    userName: 'style_daily',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975732144-442d66dffb6e?w=800&h=1200&fit=crop',
    caption: 'Weekend vibes with layers 🍂 Perfect for the fall weather',
    timestamp: '5h ago',
    likes: 89,
    isLiked: true,
    comments: [
      {
        id: 'c3',
        userId: 'u5',
        userName: 'trend_setter',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        text: 'Love the color combination!',
        timestamp: '3h ago',
        likes: 15,
        isLiked: false,
      },
    ],
    shares: 12,
  },
  {
    id: 'p3',
    userId: 'u4',
    userName: 'outfit_queen',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    imageUri: 'https://images.unsplash.com/photo-1520975867722-01286f6abf7d?w=800&h=1200&fit=crop',
    caption: 'Bold statement piece for a night out! ✨ #eveningwear #boldfashion',
    timestamp: '1d ago',
    likes: 256,
    isLiked: false,
    comments: [],
    shares: 45,
  },
];

const SocialScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, blur, isDark } = useAppTheme();
  const { user } = useAuthStore();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories] = useState<Story[]>(mockStories);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName: string } | null>(null);

  const handleLikePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  }, []);

  const handleLikeComment = useCallback((postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updateComment = (comments: Comment[]): Comment[] =>
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              };
            }
            if (comment.replies) {
              return { ...comment, replies: updateComment(comment.replies) };
            }
            return comment;
          });
        return { ...post, comments: updateComment(post.comments) };
      })
    );
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      userId: 'current_user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      text: newComment,
      timestamp: 'now',
      likes: 0,
      isLiked: false,
    };

    if (replyingTo) {
      // Add reply to parent comment
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== selectedPost.id) return post;
          const addReply = (comments: Comment[]): Comment[] =>
            comments.map((c) => {
              if (c.id === replyingTo.commentId) {
                return { ...c, replies: [...(c.replies || []), comment] };
              }
              if (c.replies) {
                return { ...c, replies: addReply(c.replies) };
              }
              return c;
            });
          return { ...post, comments: addReply(post.comments) };
        })
      );
    } else {
      // Add top-level comment
      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPost.id ? { ...post, comments: [...post.comments, comment] } : post
        )
      );
    }

    setNewComment('');
    setReplyingTo(null);
  }, [newComment, selectedPost, replyingTo]);

  const handleShare = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post))
    );
    // In real app, this would open share dialog
  }, []);

  const handleReport = useCallback((postId: string) => {
    // In real app, this would open report dialog
    console.log('Report post:', postId);
  }, []);

  const openComments = useCallback((post: Post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  }, []);

  const renderStory = useCallback(
    ({ item }: { item: Story }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.storyContainer}
        onPress={() => {
          // In real app, this would open story viewer
          console.log('View story:', item.id);
        }}
      >
        <View
          style={[
            styles.storyCircle,
            !item.isViewed && !item.isMyStory && styles.storyCircleUnviewed,
            item.isMyStory && styles.storyCircleMy,
          ]}
        >
          <Image
            source={{ uri: item.userAvatar }}
            style={styles.storyAvatar}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          {item.isMyStory && (
            <View style={styles.addStoryIcon}>
              <Icon name="plus" size={20} color="#fff" />
            </View>
          )}
        </View>
        <AppText variant="caption" style={styles.storyName} numberOfLines={1}>
          {item.isMyStory ? 'Your Story' : item.userName}
        </AppText>
      </TouchableOpacity>
    ),
    []
  );

  const renderComment = useCallback(
    (comment: Comment, depth: number = 0) => (
      <View key={comment.id} style={[styles.commentItem, depth > 0 && styles.commentReply]}>
        <Image
          source={{ uri: comment.userAvatar }}
          style={styles.commentAvatar}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={styles.commentContent}>
          <View style={[
            styles.commentBubble,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
          ]}>
            <AppText variant="body" style={[styles.commentUserName, { color: colors.textPrimary }]}>
              {comment.userName}
            </AppText>
            <AppText variant="body" style={[styles.commentText, { color: colors.textPrimary }]}>
              {comment.text}
            </AppText>
          </View>
          <View style={styles.commentActions}>
            <AppText variant="caption" style={[styles.commentTime, { color: colors.textSecondary }]}>
              {comment.timestamp}
            </AppText>
            <TouchableOpacity
              onPress={() => selectedPost && handleLikeComment(selectedPost.id, comment.id)}
              style={styles.commentActionButton}
            >
              <AppText variant="caption" style={[styles.commentActionText, { color: colors.textSecondary }]}>
                Like
              </AppText>
            </TouchableOpacity>
            {depth === 0 && (
              <TouchableOpacity
                onPress={() => setReplyingTo({ commentId: comment.id, userName: comment.userName })}
                style={styles.commentActionButton}
              >
                <AppText variant="caption" style={[styles.commentActionText, { color: colors.textSecondary }]}>
                  Reply
                </AppText>
              </TouchableOpacity>
            )}
            {comment.likes > 0 && (
              <AppText variant="caption" style={[styles.commentLikes, { color: colors.textSecondary }]}>
                {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
              </AppText>
            )}
          </View>
          {comment.replies && comment.replies.length > 0 && (
            <View style={styles.repliesContainer}>
              {comment.replies.map((reply) => renderComment(reply, depth + 1))}
            </View>
          )}
        </View>
      </View>
    ),
    [selectedPost, handleLikeComment, colors, isDark]
  );

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <View style={[
        styles.postCard,
        {
          borderRadius: borderRadius.lg,
          backgroundColor: colors.cardBackground,
          shadowColor: isDark ? '#000' : '#000',
          shadowOpacity: isDark ? 0.3 : 0.1,
        }
      ]}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postUserInfo}>
            <Image
              source={{ uri: item.userAvatar }}
              style={styles.postAvatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <View>
              <AppText variant="body" style={[styles.postUserName, { color: colors.textPrimary }]}>
                {item.userName}
              </AppText>
              <AppText variant="caption" style={[styles.postTime, { color: colors.textSecondary }]}>
                {item.timestamp}
              </AppText>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleReport(item.id)}>
            <Icon name="dots-horizontal" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Post Image */}
        <Image
          source={{ uri: item.imageUri }}
          style={styles.postImage}
          contentFit="cover"
          cachePolicy="memory-disk"
        />

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.postActionsLeft}>
            <TouchableOpacity onPress={() => handleLikePost(item.id)} style={styles.postActionButton}>
              <Icon
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={item.isLiked ? '#EF4444' : colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openComments(item)} style={styles.postActionButton}>
              <Icon name="comment-outline" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(item.id)} style={styles.postActionButton}>
              <Icon name="share-variant-outline" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleReport(item.id)}>
            <Icon name="flag-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Post Caption */}
        <View style={styles.postCaption}>
          <AppText variant="body" style={[styles.postLikes, { color: colors.textPrimary }]}>
            {item.likes} {item.likes === 1 ? 'like' : 'likes'}
          </AppText>
          <View style={styles.postCaptionText}>
            <AppText variant="body" style={[styles.postCaptionUser, { color: colors.textPrimary }]}>
              {item.userName}
            </AppText>
            <AppText variant="body" style={[styles.postCaptionContent, { color: colors.textPrimary }]}>
              {' '}
              {item.caption}
            </AppText>
          </View>
          {item.comments.length > 0 && (
            <TouchableOpacity onPress={() => openComments(item)}>
              <AppText variant="caption" style={[styles.viewComments, { color: colors.textSecondary }]}>
                View all {item.comments.length} {item.comments.length === 1 ? 'comment' : 'comments'}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ),
    [colors, borderRadius, isDark, handleLikePost, handleShare, handleReport, openComments]
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingTop: spacing.lg }]}>
          <View style={{ width: 46 }} />
          <AppText variant="display" overlay style={styles.headerTitle}>
            Social
          </AppText>
          <TouchableOpacity
            onPress={() => {
              // Navigate to Profile tab inside MainTabs
              navigation.navigate(ROUTES.MAIN_TABS, { screen: TAB_ROUTES.PROFILE });
            }}
            style={[styles.headerButton, { borderColor: colors.glassBorder, borderRadius: borderRadius.full }]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.headerButtonInner}>
                <Avatar name={user?.name || 'U'} size={28} />
              </BlurView>
            ) : (
              <View style={[styles.headerButtonInner, styles.headerButtonAndroid]}>
                <Avatar name={user?.name || 'U'} size={28} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
        >
          {/* Stories Section */}
          <View style={[styles.storiesSection, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={stories}
              renderItem={renderStory}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.storiesList}
            />
          </View>

          {/* Post Creation Area */}
          <View style={[styles.createPostSection, { paddingHorizontal: spacing.lg, marginBottom: spacing.lg }]}>
            <View style={[
              styles.createPostCard,
              {
                borderRadius: borderRadius.lg,
                borderColor: colors.glassBorder,
                backgroundColor: colors.cardBackground,
              }
            ]}>
              {Platform.OS === 'ios' ? (
                <BlurView intensity={blur.medium} tint={isDark ? 'dark' : 'light'} style={styles.createPostInner}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.createPostButton}
                    onPress={() => {
                      // In real app, this would open post creation screen
                      console.log('Create post');
                    }}
                  >
                    <Icon name="image-outline" size={24} color={colors.textPrimary} />
                    <AppText variant="body" style={styles.createPostText}>
                      What's on your mind?
                    </AppText>
                  </TouchableOpacity>
                  <View style={styles.createPostActions}>
                    <TouchableOpacity style={styles.createPostAction}>
                      <Icon name="image-multiple-outline" size={20} color={colors.accent} />
                      <AppText variant="caption" style={styles.createPostActionText}>
                        Photo
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createPostAction}>
                      <Icon name="emoticon-happy-outline" size={20} color={colors.accent} />
                      <AppText variant="caption" style={styles.createPostActionText}>
                        Feeling
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              ) : (
                <View style={[styles.createPostInner, styles.createPostAndroid]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.createPostButton}
                    onPress={() => {
                      // In real app, this would open post creation screen
                      console.log('Create post');
                    }}
                  >
                    <Icon name="image-outline" size={24} color={colors.textPrimary} />
                    <AppText variant="body" style={styles.createPostText}>
                      What's on your mind?
                    </AppText>
                  </TouchableOpacity>
                  <View style={styles.createPostActions}>
                    <TouchableOpacity style={styles.createPostAction}>
                      <Icon name="image-multiple-outline" size={20} color={colors.accent} />
                      <AppText variant="caption" style={styles.createPostActionText}>
                        Photo
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createPostAction}>
                      <Icon name="emoticon-happy-outline" size={20} color={colors.accent} />
                      <AppText variant="caption" style={styles.createPostActionText}>
                        Feeling
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* News Feed */}
          <View style={styles.feedSection}>
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: spacing.xl }} />}
              contentContainerStyle={[styles.feedList, { paddingHorizontal: spacing.lg }]}
            />
          </View>
        </Animated.ScrollView>

        {/* Bottom Navigation Bar */}
        <BottomNavigationBar scrollY={scrollY} showOnScrollUp={true} />

        {/* Comments Modal */}
        <Modal
          visible={commentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setCommentModalVisible(false);
            setReplyingTo(null);
            setNewComment('');
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.modalHeader}>
                <AppText variant="h1" style={styles.modalTitle}>
                  Comments
                </AppText>
                <TouchableOpacity
                  onPress={() => {
                    setCommentModalVisible(false);
                    setReplyingTo(null);
                    setNewComment('');
                  }}
                >
                  <Icon name="close" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <FlatList
                data={selectedPost?.comments || []}
                renderItem={({ item }) => renderComment(item)}
                keyExtractor={(item) => item.id}
                style={styles.commentsList}
                contentContainerStyle={styles.commentsListContent}
              />

              {replyingTo && (
                <View style={[
                  styles.replyingTo,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }
                ]}>
                  <AppText variant="caption" style={[styles.replyingToText, { color: colors.textSecondary }]}>
                    Replying to {replyingTo.userName}
                  </AppText>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <Icon name="close" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={[
                styles.commentInputContainer,
                {
                  borderColor: colors.glassBorder,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                }
              ]}>
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      color: colors.textPrimary,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    }
                  ]}
                  placeholder="Add a comment..."
                  placeholderTextColor={colors.textSecondary}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                  style={[
                    styles.commentSendButton,
                    { opacity: newComment.trim() ? 1 : 0.5 },
                  ]}
                >
                  <Icon name="send" size={24} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerButton: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  headerButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonAndroid: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: {
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  storiesSection: {
    marginTop: 12,
  },
  storiesList: {
    paddingRight: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 2,
    marginBottom: 6,
  },
  storyCircleUnviewed: {
    borderColor: '#00FF88',
    borderWidth: 3,
  },
  storyCircleMy: {
    borderColor: 'rgba(255,255,255,0.5)',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
  },
  createPostSection: {
    marginBottom: 20,
  },
  createPostCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  createPostInner: {
    padding: spacingConstants.lg,
  },
  createPostAndroid: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingConstants.md,
    gap: 12,
  },
  createPostText: {
    flex: 1,
    opacity: 0.7,
  },
  createPostActions: {
    flexDirection: 'row',
    gap: spacingConstants.lg,
    paddingTop: spacingConstants.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  createPostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createPostActionText: {
    fontWeight: '600',
  },
  feedSection: {
    flex: 1,
  },
  feedList: {
    paddingBottom: 20,
  },
  postCard: {
    overflow: 'hidden',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacingConstants.md,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUserName: {
    fontWeight: '700',
  },
  postTime: {
    fontSize: 12,
  },
  postImage: {
    width: '100%',
    height: SCREEN_WIDTH,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacingConstants.md,
  },
  postActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  postActionButton: {
    padding: 4,
  },
  postCaption: {
    paddingHorizontal: spacingConstants.md,
    paddingBottom: spacingConstants.md,
  },
  postLikes: {
    fontWeight: '700',
    marginBottom: 8,
  },
  postCaptionText: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  postCaptionUser: {
    fontWeight: '700',
  },
  postCaptionContent: {
    flex: 1,
  },
  viewComments: {
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingConstants.lg,
    paddingBottom: spacingConstants.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontWeight: '700',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    padding: spacingConstants.lg,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: spacingConstants.md,
  },
  commentReply: {
    marginLeft: 40,
    marginTop: spacingConstants.sm,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: 16,
    padding: spacingConstants.sm,
    marginBottom: 4,
  },
  commentUserName: {
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: spacingConstants.sm,
  },
  commentTime: {
    opacity: 0.6,
    fontSize: 11,
  },
  commentActionButton: {
    paddingVertical: 4,
  },
  commentActionText: {
    fontWeight: '600',
    opacity: 0.7,
  },
  commentLikes: {
    opacity: 0.6,
    fontSize: 11,
  },
  repliesContainer: {
    marginTop: spacingConstants.sm,
    paddingLeft: spacingConstants.md,
  },
  replyingTo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacingConstants.lg,
    paddingVertical: spacingConstants.sm,
  },
  replyingToText: {
    opacity: 0.7,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacingConstants.md,
    borderTopWidth: 1,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
    padding: spacingConstants.sm,
    borderRadius: 20,
    fontSize: 14,
  },
  commentSendButton: {
    padding: spacingConstants.sm,
  },
});

SocialScreen.displayName = 'SocialScreen';

export { SocialScreen };

