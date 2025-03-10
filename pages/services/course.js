import React, { useState } from 'react';
import { Search, BookOpen, Plus, Bookmark, Star } from 'lucide-react';

const CourseCatalog = () => {
  // Sample course data (replace with actual DB data)
  const [courses] = useState([
    { id: 1, title: 'Introduction to React', category: 'Web Development', rating: 4.5, saved: false },
    { id: 2, title: 'Python for Beginners', category: 'Programming', rating: 4.8, saved: true },
    { id: 3, title: 'Data Structures', category: 'Computer Science', rating: 4.3, saved: false },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedCourses, setSavedCourses] = useState(courses.filter(course => course.saved));
  const [activeTab, setActiveTab] = useState('all');

  const handleSaveCourse = (courseId) => {
    setSavedCourses(prev => {
      const course = courses.find(c => c.id === courseId);
      return prev.some(c => c.id === courseId) 
        ? prev.filter(c => c.id !== courseId)
        : [...prev, course];
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Create Course with AI
        </button>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Courses
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'all' ? filteredCourses : savedCourses).map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onSave={() => handleSaveCourse(course.id)}
            isSaved={savedCourses.some(c => c.id === course.id)}
          />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ course, onSave, isSaved }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <button 
            onClick={onSave}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current text-blue-500' : 'text-gray-400'}`} />
          </button>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <BookOpen className="h-4 w-4 mr-2" />
          {course.category}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm">{course.rating}</span>
          </div>
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50 text-sm">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCatalog;