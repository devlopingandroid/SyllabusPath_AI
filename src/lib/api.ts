// src/lib/api.ts

import axios from "axios";
import { supabase } from "./supabase";

// --------------------------------------
//  BASE NODE BACKEND API SETUP
// --------------------------------------
export const API_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false, // Backend is simple, no cookies needed
});

// Inject Supabase JWT token (if logged in)
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export default api;

// -----------------------------------------------------
//  TYPE DECLARATIONS FOR SyllabusPath AI
// -----------------------------------------------------

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  syllabus_content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  plan_id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimated_minutes: number;
  order_index: number;
  created_at: string;
  progress?: number;
}

export interface Video {
  id: string;
  topic_id: string;
  title: string;
  channel: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  topic_id: string;
  progress_percentage: number;
  time_spent_minutes: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------
//  AI GENERATION SERVICE (Node backend)
// -----------------------------------------------------

export const aiService = {
  async generatePublic(syllabus: string) {
    const res = await api.post("/generate-public", {
      syllabusText: syllabus,
    });
    return res.data;
  },

  async generateProtected(syllabus: string) {
    const res = await api.post("/generate", {
      syllabusText: syllabus,
    });
    return res.data;
  },

  async improveAI(data: any) {
    const res = await api.post("/ai-improve", data);
    return res.data;
  },

  async exportPDF(payload: any) {
    const res = await api.post("/export-pdf", payload, {
      responseType: "blob",
    });
    return res.data;
  },
};

// -----------------------------------------------------
//  SUPABASE DATABASE SERVICES
// -----------------------------------------------------

export const planService = {
  async createPlan(syllabusContent: string, title = "My Study Plan"): Promise<Plan> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("plans")
      .insert({
        user_id: user.id,
        title,
        syllabus_content: syllabusContent,
        status: "completed",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPlan(planId: string): Promise<Plan> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (error) throw error;
    return data;
  },
};

// -----------------------------------------------------
//  TOPICS (Supabase)
// -----------------------------------------------------

export const topicService = {
  async createTopic(planId: string, topic: Partial<Topic>): Promise<Topic> {
    const { data, error } = await supabase
      .from("topics")
      .insert({ plan_id: planId, ...topic })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTopicsByPlan(planId: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from("topics")
      .select("*")
      .eq("plan_id", planId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// -----------------------------------------------------
//  VIDEOS (Supabase)
// -----------------------------------------------------

export const videoService = {
  async createVideo(topicId: string, video: Partial<Video>): Promise<Video> {
    const { data, error } = await supabase
      .from("videos")
      .insert({ topic_id: topicId, ...video })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVideosByTopic(topicId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("topic_id", topicId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};

// -----------------------------------------------------
//  PROGRESS (Supabase)
// -----------------------------------------------------

export const progressService = {
  async updateProgress(topicId: string, progressPercentage: number): Promise<Progress> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("topic_progress")
      .upsert({
        user_id: user.id,
        topic_id: topicId,
        progress_percentage: progressPercentage,
        last_accessed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProgressByTopic(topicId: string): Promise<Progress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("topic_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllProgress(): Promise<Progress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("topic_progress")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;
    return data || [];
  },
};
