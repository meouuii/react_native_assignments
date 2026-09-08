import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

// ---------- Shared types & data ----------

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  description: string;
}

const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Intro to React Native',
    instructor: 'Sarah Ahmed',
    category: 'Programming',
    description: 'Learn the basics of building mobile apps with RN.',
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    instructor: 'Omar Khaled',
    category: 'Programming',
    description: 'Deep dive into closures, async/await, and prototypes.',
  },
  {
    id: '3',
    title: 'UI/UX Fundamentals',
    instructor: 'Laila Hassan',
    category: 'Design',
    description: 'Principles of usable and beautiful interfaces.',
  },
  {
    id: '4',
    title: 'Figma for Designers',
    instructor: 'Youssef Adel',
    category: 'Design',
    description: 'Prototyping and design systems in Figma.',
  },
  {
    id: '5',
    title: 'Marketing 101',
    instructor: 'Nour Ibrahim',
    category: 'Business',
    description: 'Fundamentals of digital marketing strategy.',
  },
  {
    id: '6',
    title: 'Startup Finance',
    instructor: 'Mona Fathy',
    category: 'Business',
    description: 'Budgeting and fundraising basics for startups.',
  },
];

const CATEGORIES = ['Programming', 'Design', 'Business'];

// ---------- Home Tab: ScrollView ----------

function HomeScreen() {
  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Welcome to My Courses</Text>
        <Text style={styles.subheading}>
          Browse, add, and organize courses across categories.
        </Text>

        {CATEGORIES.map(category => (
          <View key={category} style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{category}</Text>
            <Text style={styles.infoCardText}>
              Explore {category.toLowerCase()} courses taught by industry
              experts. New content is added every month, and each course
              includes hands-on projects to practice what you learn.
            </Text>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>How it works</Text>
          <Text style={styles.infoCardText}>
            1. Go to the "Add Course" tab and fill in the form.{'\n'}
            2. Your course is added to the shared list instantly.{'\n'}
            3. Visit the "Courses" tab to see it in the full list and grouped
            by category.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>About this app</Text>
          <Text style={styles.infoCardText}>
            This screen demonstrates a scrollable layout with multiple
            sections of content, built using React Native's ScrollView
            component.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Add Course Tab: Form + useState ----------

function AddCourseScreen({
  onAddCourse,
}: {
  onAddCourse: (course: Course) => void;
}) {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !instructor.trim() || !category.trim()) {
      setConfirmation('Please fill in title, instructor, and category.');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
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
  };

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Add a New Course</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Intro to Python"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Instructor</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. John Smith"
            value={instructor}
            onChangeText={setInstructor}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Programming, Design, or Business"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Short description of the course"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        {confirmation ? (
          <Text style={styles.confirmation}>{confirmation}</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Courses Tab: useEffect + map() + FlatList + SectionList ----------

function CoursesScreen({ courses }: { courses: Course[] }) {
  const [loading, setLoading] = useState(true);

  // useEffect: runs whenever the course list changes, simulating a
  // load/refresh side effect (e.g. re-syncing data when new courses arrive).
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      console.log(`Courses updated — total: ${courses.length}`);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [courses]);

  const sections = CATEGORIES.map(category => ({
    title: category,
    data: courses.filter(c => c.category === category),
  })).filter(section => section.data.length > 0);

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <View style={styles.screenPadding}>
        <Text style={styles.heading}>All Courses</Text>
        {loading && <Text style={styles.subheading}>Refreshing list…</Text>}

        <Text style={styles.sectionLabel}>Categories (map)</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(category => (
            <View key={category} style={styles.chip}>
              <Text style={styles.chipText}>{category}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Course List (FlatList)</Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={item => item.id}
        style={styles.flatListFixedHeight}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseMeta}>
              {item.instructor} • {item.category}
            </Text>
            {item.description ? (
              <Text style={styles.courseDesc}>{item.description}</Text>
            ) : null}
          </View>
        )}
      />

      <View style={styles.screenPadding}>
        <Text style={styles.sectionLabel}>Grouped by Category (SectionList)</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        style={styles.flatListFixedHeight}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseMeta}>{item.instructor}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ---------- Root App with Bottom Tab Navigation ----------

const Tab = createBottomTabNavigator();

function App() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: true }}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Add Course">
            {() => <AddCourseScreen onAddCourse={addCourse} />}
          </Tab.Screen>
          <Tab.Screen name="Courses">
            {() => <CoursesScreen courses={courses} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screenPadding: { paddingHorizontal: 16, paddingTop: 12 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subheading: { fontSize: 14, color: '#555', marginBottom: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#f2f4f7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  infoCardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoCardText: { fontSize: 13, color: '#444', lineHeight: 19 },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: { height: 90, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#2f6fed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  confirmation: { marginTop: 12, color: '#2f6fed', fontSize: 13 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    backgroundColor: '#e6ecfb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: { fontSize: 13, color: '#2f6fed', fontWeight: '600' },
  flatListFixedHeight: { maxHeight: 170 },
  courseCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  courseTitle: { fontSize: 15, fontWeight: '700' },
  courseMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  courseDesc: { fontSize: 12, color: '#444', marginTop: 4 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});

export default App;
