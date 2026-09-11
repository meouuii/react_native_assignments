import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  SectionList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import api from './src/api/api';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Button from './src/components/Button';
import Card from './src/components/Card';
import Input from './src/components/Input';
import Loading from './src/components/Loading';

// ---------- Shared types ----------

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  description: string;
  featured?: boolean;
}

const CATEGORIES = ['Programming', 'Design', 'Business'];

// Maps a JSONPlaceholder "post" onto our Course shape so the demo API
// stands in for a real courses backend.
function postToCourse(post: any): Course {
  return {
    id: String(post.id),
    title: post.title ? post.title.slice(0, 40) : `Course ${post.id}`,
    instructor: `Instructor ${post.userId ?? '—'}`,
    category: CATEGORIES[post.id % CATEGORIES.length],
    description: post.body ? post.body.slice(0, 80) : '',
    featured: false,
  };
}

// ---------- Home Tab: ScrollView + Context (theme) ----------

function HomeScreen() {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Welcome to My Courses
        </Text>
        <Text style={[styles.subheading, { color: colors.subtext }]}>
          Current theme: {theme}
        </Text>

        <Button title="Toggle Light / Dark Theme" onPress={toggleTheme} />

        {CATEGORIES.map(category => (
          <Card key={category} title={category}>
            <Text style={{ color: colors.subtext, fontSize: 13, lineHeight: 19 }}>
              Explore {category.toLowerCase()} courses taught by industry
              experts, with hands-on projects to practice what you learn.
            </Text>
          </Card>
        ))}

        <Card title="About this app">
          <Text style={{ color: colors.subtext, fontSize: 13, lineHeight: 19 }}>
            Course data is fetched from a public API with Axios, theme state
            is shared through Context, and the UI is built from reusable
            Button, Card, Input, and Loading components.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Add Course Tab: Form + Axios POST ----------

function AddCourseScreen({
  onAddCourse,
}: {
  onAddCourse: (course: Course) => void;
}) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setConfirmation('');
    if (!title.trim() || !instructor.trim() || !category.trim()) {
      setError('Please fill in title, instructor, and category.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      // POST the new course to the API.
      const response = await api.post('/posts', {
        title: title.trim(),
        body: description.trim(),
        userId: 1,
      });

      const newCourse: Course = {
        id: String(response.data.id ?? Date.now()),
        title: title.trim(),
        instructor: instructor.trim(),
        category: category.trim(),
        description: description.trim(),
      };

      onAddCourse(newCourse);
      setConfirmation(`"${newCourse.title}" was added successfully!`);
      setTitle('');
      setInstructor('');
      setCategory('');
      setDescription('');
    } catch (err) {
      setError('Something went wrong while saving the course.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Add a New Course
        </Text>

        <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Intro to Python" />
        <Input label="Instructor" value={instructor} onChangeText={setInstructor} placeholder="e.g. John Smith" />
        <Input label="Category" value={category} onChangeText={setCategory} placeholder="Programming, Design, or Business" />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Short description of the course"
          multiline
          error={error}
        />

        <Button title="Submit" onPress={handleSubmit} loading={submitting} />

        {confirmation ? (
          <Text style={[styles.confirmation, { color: colors.primary }]}>
            {confirmation}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Courses Tab: Axios GET/PUT/DELETE + map + FlatList + SectionList ----------

function CoursesScreen({
  courses,
  setCourses,
}: {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // GET: fetch the initial course list once when this screen mounts.
  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts', { params: { _limit: 6 } });
        if (isMounted) {
          setCourses(response.data.map(postToCourse));
        }
      } catch (err) {
        if (isMounted) setErrorMsg('Could not load courses. Pull to retry.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [setCourses]);

  // PUT: toggle a course's "featured" flag.
  const toggleFeatured = async (course: Course) => {
    try {
      await api.put(`/posts/${course.id}`, {
        id: course.id,
        title: course.title,
        body: course.description,
        featured: !course.featured,
      });
      setCourses(prev =>
        prev.map(c =>
          c.id === course.id ? { ...c, featured: !c.featured } : c,
        ),
      );
    } catch (err) {
      setErrorMsg('Could not update that course.');
    }
  };

  // DELETE: remove a course.
  const deleteCourse = async (course: Course) => {
    try {
      await api.delete(`/posts/${course.id}`);
      setCourses(prev => prev.filter(c => c.id !== course.id));
    } catch (err) {
      setErrorMsg('Could not delete that course.');
    }
  };

  const sections = CATEGORIES.map(category => ({
    title: category,
    data: courses.filter(c => c.category === category),
  })).filter(section => section.data.length > 0);

  const renderCourseCard = (item: Course) => (
    <Card key={item.id}>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>
        {item.featured ? '⭐ ' : ''}
        {item.title}
      </Text>
      <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 2 }}>
        {item.instructor} • {item.category}
      </Text>
      {item.description ? (
        <Text style={{ color: colors.subtext, fontSize: 12, marginTop: 4 }}>
          {item.description}
        </Text>
      ) : null}
      <View style={styles.cardActions}>
        <Button
          title={item.featured ? 'Unfeature' : 'Feature'}
          variant="secondary"
          onPress={() => toggleFeatured(item)}
        />
        <Button title="Delete" variant="danger" onPress={() => deleteCourse(item)} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <View style={styles.screenPadding}>
        <Text style={[styles.heading, { color: colors.text }]}>All Courses</Text>
        {errorMsg ? <Text style={{ color: colors.danger }}>{errorMsg}</Text> : null}

        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Categories (map)
        </Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(category => (
            <View key={category} style={[styles.chip, { backgroundColor: colors.card }]}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                {category}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {loading ? (
        <Loading message="Fetching courses from the API..." />
      ) : (
        <>
          <View style={styles.screenPadding}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Course List (FlatList)
            </Text>
          </View>
          <FlatList
            data={courses}
            keyExtractor={item => item.id}
            style={styles.listFixedHeight}
            contentContainerStyle={styles.screenPadding}
            renderItem={({ item }) => renderCourseCard(item)}
          />

          <View style={styles.screenPadding}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>
              Grouped by Category (SectionList)
            </Text>
          </View>
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            style={styles.listFixedHeight}
            contentContainerStyle={styles.screenPadding}
            renderSectionHeader={({ section }) => (
              <Text style={[styles.sectionHeader, { color: colors.text, backgroundColor: colors.card }]}>
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => renderCourseCard(item)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

// ---------- Root App ----------

const Tab = createBottomTabNavigator();

function RootTabs() {
  const [courses, setCourses] = useState<Course[]>([]);

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add Course">
          {() => <AddCourseScreen onAddCourse={addCourse} />}
        </Tab.Screen>
        <Tab.Screen name="Courses">
          {() => <CoursesScreen courses={courses} setCourses={setCourses} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootTabs />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenPadding: { paddingHorizontal: 16, paddingTop: 12 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subheading: { fontSize: 14, marginBottom: 16 },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  confirmation: { marginTop: 12, fontSize: 13 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  listFixedHeight: { maxHeight: 220 },
  sectionHeader: { fontSize: 14, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 4 },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 10 },
});

export default App;
