'use client';

import { useState } from 'react';
import { Package, Download, Settings, Trash2, Search, Grid3X3, List, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skill } from '@/lib/types';
import { cn, truncate } from '@/lib/utils';

interface SkillsInventoryProps {
  skills: Skill[];
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'ready' | 'missing' | 'update';

export function SkillsInventory({ skills }: SkillsInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterStatus>('all');

  const categories = Array.from(new Set(skills.map(s => s.category)));
  
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'ready') return matchesSearch && skill.status === 'ready';
    if (filter === 'missing') return matchesSearch && skill.status === 'missing';
    if (filter === 'update') return matchesSearch && skill.status === 'update-available';
    return matchesSearch;
  });

  const getStatusIcon = (status: Skill['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'missing':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'update-available':
        return <RefreshCw className="h-4 w-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: Skill['status']) => {
    switch (status) {
      case 'ready':
        return <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">Ready</Badge>;
      case 'missing':
        return <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-xs">Missing</Badge>;
      case 'update-available':
        return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">Update</Badge>;
      case 'error':
        return <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-xs">Error</Badge>;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-white">
                Skills Inventory
              </CardTitle>
              <p className="text-xs text-white/50">
                {skills.filter(s => s.status === 'ready').length}/{skills.length} ready
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:bg-white/5">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Install
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:bg-white/5">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Sync
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input 
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-md p-1">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'grid' ? "bg-white/10 text-white" : "text-white/40"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'list' ? "bg-white/10 text-white" : "text-white/40"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)} className="mt-2">
          <TabsList className="bg-white/5 flex-wrap h-auto">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white/10">
              All {skills.length}
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs data-[state=active]:bg-white/10">
              Ready {skills.filter(s => s.status === 'ready').length}
            </TabsTrigger>
            <TabsTrigger value="missing" className="text-xs data-[state=active]:bg-white/10">
              Missing {skills.filter(s => s.status === 'missing').length}
            </TabsTrigger>
            <TabsTrigger value="update" className="text-xs data-[state=active]:bg-white/10">
              Updates {skills.filter(s => s.status === 'update-available').length}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSkills.map((skill) => (
                <div 
                  key={skill.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    skill.status === 'ready' 
                      ? "bg-green-500/5 border-green-500/20" 
                      : skill.status === 'missing'
                      ? "bg-red-500/5 border-red-500/20"
                      : skill.status === 'update-available'
                      ? "bg-yellow-500/5 border-yellow-500/20"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon || '📦'}</span>
                      <span className="font-medium text-sm text-white">{skill.displayName}</span>
                    </div>
                    {getStatusBadge(skill.status)}
                  </div>
                  
                  <p className="text-xs text-white/50 mb-3 line-clamp-2">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{skill.category}</span>
                    <span className="text-white/40 font-mono">v{skill.version}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10">
                      Docs
                    </Button>
                    {skill.status === 'ready' && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-white/60 hover:text-white hover:bg-white/10">
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </Button>
                    )}
                    {skill.status === 'update-available' && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSkills.map((skill) => (
                <div 
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{skill.icon || '📦'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white">{skill.displayName}</span>
                        {getStatusBadge(skill.status)}
                      </div>
                      <p className="text-xs text-white/40">{skill.category} • v{skill.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/40 hover:text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-white/40">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No skills found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
