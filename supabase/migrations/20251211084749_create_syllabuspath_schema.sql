/*
  # SyllabusPath AI Database Schema

  ## Overview
  Creates the complete database schema for SyllabusPath AI, an AI-powered study planner that generates personalized roadmaps and curated resources.

  ## New Tables Created

  ### 1. `plans`
  Stores user-submitted syllabi and generated study plans
  - `id` (uuid, primary key) - Unique plan identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `title` (text) - Plan title/name
  - `syllabus_content` (text) - Original syllabus input
  - `status` (text) - Plan status: 'generating', 'completed', 'failed'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `topics`
  Individual topics/modules within each study plan
  - `id` (uuid, primary key) - Unique topic identifier
  - `plan_id` (uuid, foreign key) - References plans table
  - `title` (text) - Topic title
  - `description` (text) - Topic description
  - `difficulty` (text) - Difficulty level: 'Beginner', 'Intermediate', 'Advanced'
  - `estimated_minutes` (integer) - Estimated study time
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. `videos`
  Curated YouTube videos for each topic
  - `id` (uuid, primary key) - Unique video identifier
  - `topic_id` (uuid, foreign key) - References topics table
  - `title` (text) - Video title
  - `channel` (text) - YouTube channel name
  - `url` (text) - YouTube video URL
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `topic_progress`
  Tracks user progress on each topic
  - `id` (uuid, primary key) - Unique progress record identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `topic_id` (uuid, foreign key) - References topics table
  - `progress_percentage` (integer) - Progress from 0-100
  - `time_spent_minutes` (integer) - Total time spent
  - `last_accessed_at` (timestamptz) - Last access timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own plans and progress
  - Authenticated users can read all topics and videos within their plans
  - Policies enforce data isolation between users

  ## Notes
  - Uses UUID for all primary keys
  - Includes proper foreign key constraints
  - Default values provided for timestamps and status fields
  - Indexes added for common query patterns
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Plan',
  syllabus_content text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Beginner',
  estimated_minutes integer DEFAULT 30,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  channel text NOT NULL,
  url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create topic_progress table
CREATE TABLE IF NOT EXISTS topic_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_plan_id ON topics(plan_id);
CREATE INDEX IF NOT EXISTS idx_videos_topic_id ON videos(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_topic_id ON topic_progress(topic_id);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans table
CREATE POLICY "Users can view own plans"
  ON plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans"
  ON plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
  ON plans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for topics table
CREATE POLICY "Users can view topics from own plans"
  ON topics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = topics.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert topics to own plans"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = topics.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update topics in own plans"
  ON topics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = topics.plan_id
      AND plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = topics.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete topics from own plans"
  ON topics FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = topics.plan_id
      AND plans.user_id = auth.uid()
    )
  );

-- RLS Policies for videos table
CREATE POLICY "Users can view videos from own plan topics"
  ON videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM topics
      JOIN plans ON plans.id = topics.plan_id
      WHERE topics.id = videos.topic_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert videos to own plan topics"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM topics
      JOIN plans ON plans.id = topics.plan_id
      WHERE topics.id = videos.topic_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update videos in own plan topics"
  ON videos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM topics
      JOIN plans ON plans.id = topics.plan_id
      WHERE topics.id = videos.topic_id
      AND plans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM topics
      JOIN plans ON plans.id = topics.plan_id
      WHERE topics.id = videos.topic_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete videos from own plan topics"
  ON videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM topics
      JOIN plans ON plans.id = topics.plan_id
      WHERE topics.id = videos.topic_id
      AND plans.user_id = auth.uid()
    )
  );

-- RLS Policies for topic_progress table
CREATE POLICY "Users can view own progress"
  ON topic_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON topic_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON topic_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON topic_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);