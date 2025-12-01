import React from 'react';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stageId: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  order: number;
  color: string;
}

export interface LeadList {
  id: string;
  title: string;
  count: number;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}