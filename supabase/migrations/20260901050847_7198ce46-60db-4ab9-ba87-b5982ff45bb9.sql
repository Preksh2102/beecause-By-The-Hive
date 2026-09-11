-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  number text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.projects
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- stories
CREATE TABLE public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  story_date text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  body text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stories TO authenticated;
GRANT ALL ON public.stories TO service_role;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published stories are public" ON public.stories
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins read all stories" ON public.stories
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert stories" ON public.stories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update stories" ON public.stories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete stories" ON public.stories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER stories_updated_at BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- volunteer applications (private)
CREATE TABLE public.volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  interests text[] NOT NULL DEFAULT '{}',
  availability text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.volunteer_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteer_applications TO authenticated;
GRANT ALL ON public.volunteer_applications TO service_role;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.volunteer_applications
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND reviewed_at IS NULL AND length(name) BETWEEN 1 AND 120 AND length(email) BETWEEN 3 AND 255 AND length(message) <= 2000);
CREATE POLICY "Admins read applications" ON public.volunteer_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.volunteer_applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete applications" ON public.volunteer_applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER volunteer_applications_updated_at BEFORE UPDATE ON public.volunteer_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- volunteers (public, approved)
CREATE TABLE public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  blurb text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  application_id uuid REFERENCES public.volunteer_applications(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.volunteers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT ALL ON public.volunteers TO service_role;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active volunteers are public" ON public.volunteers
  FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins read all volunteers" ON public.volunteers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert volunteers" ON public.volunteers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update volunteers" ON public.volunteers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete volunteers" ON public.volunteers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER volunteers_updated_at BEFORE UPDATE ON public.volunteers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- contact submissions (private)
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'new' AND length(name) BETWEEN 1 AND 120 AND length(email) BETWEEN 3 AND 255 AND length(message) BETWEEN 1 AND 4000);
CREATE POLICY "Admins read submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- seed projects
INSERT INTO public.projects (slug, number, title, description, category, year, intro, cover_image, gallery, body, facts, sort_order) VALUES
('project-01','01','Project 01','[PROJECT DESCRIPTION REQUIRED]','[CATEGORY]','[YEAR]','[PROJECT INTRO REQUIRED — one or two sentences.]','/images/project-01.jpg', ARRAY['/images/project-02.jpg','/images/project-03.jpg'],
 '[{"heading":"The context","paragraphs":["[CLIENT COPY REQUIRED — describe the community, the need, and how the project began.]","[CLIENT COPY REQUIRED — second paragraph.]"]},{"heading":"What we did","paragraphs":["[CLIENT COPY REQUIRED — the approach, the people involved, the making.]"]},{"heading":"What changed","paragraphs":["[CLIENT COPY REQUIRED — outcomes, reflections, what comes next.]"]}]'::jsonb,
 '[{"label":"Location","value":"[LOCATION REQUIRED]"},{"label":"Partners","value":"[PARTNERS REQUIRED]"},{"label":"Timeframe","value":"[TIMEFRAME REQUIRED]"},{"label":"Outcome","value":"[OUTCOME FIGURE REQUIRED]"}]'::jsonb, 1),
('project-02','02','Project 02','[PROJECT DESCRIPTION REQUIRED]','[CATEGORY]','[YEAR]','[PROJECT INTRO REQUIRED — one or two sentences.]','/images/project-02.jpg', ARRAY['/images/project-03.jpg','/images/project-01.jpg'],
 '[{"heading":"The context","paragraphs":["[CLIENT COPY REQUIRED — describe the community, the need, and how the project began.]","[CLIENT COPY REQUIRED — second paragraph.]"]},{"heading":"What we did","paragraphs":["[CLIENT COPY REQUIRED — the approach, the people involved, the making.]"]},{"heading":"What changed","paragraphs":["[CLIENT COPY REQUIRED — outcomes, reflections, what comes next.]"]}]'::jsonb,
 '[{"label":"Location","value":"[LOCATION REQUIRED]"},{"label":"Partners","value":"[PARTNERS REQUIRED]"},{"label":"Timeframe","value":"[TIMEFRAME REQUIRED]"},{"label":"Outcome","value":"[OUTCOME FIGURE REQUIRED]"}]'::jsonb, 2),
('project-03','03','Project 03','[PROJECT DESCRIPTION REQUIRED]','[CATEGORY]','[YEAR]','[PROJECT INTRO REQUIRED — one or two sentences.]','/images/project-03.jpg', ARRAY['/images/project-01.jpg','/images/project-02.jpg'],
 '[{"heading":"The context","paragraphs":["[CLIENT COPY REQUIRED — describe the community, the need, and how the project began.]","[CLIENT COPY REQUIRED — second paragraph.]"]},{"heading":"What we did","paragraphs":["[CLIENT COPY REQUIRED — the approach, the people involved, the making.]"]},{"heading":"What changed","paragraphs":["[CLIENT COPY REQUIRED — outcomes, reflections, what comes next.]"]}]'::jsonb,
 '[{"label":"Location","value":"[LOCATION REQUIRED]"},{"label":"Partners","value":"[PARTNERS REQUIRED]"},{"label":"Timeframe","value":"[TIMEFRAME REQUIRED]"},{"label":"Outcome","value":"[OUTCOME FIGURE REQUIRED]"}]'::jsonb, 3),
('project-04','04','Project 04','[PROJECT DESCRIPTION REQUIRED]','[CATEGORY]','[YEAR]','[PROJECT INTRO REQUIRED — one or two sentences.]','/images/project-01.jpg', ARRAY['/images/project-02.jpg','/images/project-03.jpg'],
 '[{"heading":"The context","paragraphs":["[CLIENT COPY REQUIRED — describe the community, the need, and how the project began.]","[CLIENT COPY REQUIRED — second paragraph.]"]},{"heading":"What we did","paragraphs":["[CLIENT COPY REQUIRED — the approach, the people involved, the making.]"]},{"heading":"What changed","paragraphs":["[CLIENT COPY REQUIRED — outcomes, reflections, what comes next.]"]}]'::jsonb,
 '[{"label":"Location","value":"[LOCATION REQUIRED]"},{"label":"Partners","value":"[PARTNERS REQUIRED]"},{"label":"Timeframe","value":"[TIMEFRAME REQUIRED]"},{"label":"Outcome","value":"[OUTCOME FIGURE REQUIRED]"}]'::jsonb, 4);

-- seed stories
INSERT INTO public.stories (slug, title, category, excerpt, author, story_date, quote, cover_image, body, sort_order) VALUES
('story-01','[STORY TITLE REQUIRED]','[CATEGORY]','[STORY EXCERPT REQUIRED]','[AUTHOR REQUIRED]','[DATE REQUIRED]','[PULL QUOTE REQUIRED]','/images/story-01.jpg', ARRAY['[CLIENT COPY REQUIRED — opening paragraph of the story.]','[CLIENT COPY REQUIRED — second paragraph.]','[CLIENT COPY REQUIRED — third paragraph.]'], 1),
('story-02','[STORY TITLE REQUIRED]','[CATEGORY]','[STORY EXCERPT REQUIRED]','[AUTHOR REQUIRED]','[DATE REQUIRED]','[PULL QUOTE REQUIRED]','/images/story-02.jpg', ARRAY['[CLIENT COPY REQUIRED — opening paragraph of the story.]','[CLIENT COPY REQUIRED — second paragraph.]','[CLIENT COPY REQUIRED — third paragraph.]'], 2),
('story-03','[STORY TITLE REQUIRED]','[CATEGORY]','[STORY EXCERPT REQUIRED]','[AUTHOR REQUIRED]','[DATE REQUIRED]','[PULL QUOTE REQUIRED]','/images/story-01.jpg', ARRAY['[CLIENT COPY REQUIRED — opening paragraph of the story.]','[CLIENT COPY REQUIRED — second paragraph.]','[CLIENT COPY REQUIRED — third paragraph.]'], 3);

-- seed volunteers
INSERT INTO public.volunteers (name, role, blurb, avatar_url, sort_order) VALUES
('[NAME]','[ROLE]','','/images/person-01.jpg',1),
('[NAME]','[ROLE]','','/images/person-02.jpg',2),
('[NAME]','[ROLE]','','/images/person-03.jpg',3);